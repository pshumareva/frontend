import { Modal, Box, Typography, Button, Grid, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Person, UpdatePerson, UpdateUserAccount } from 'gql/person'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { ApiErrors } from 'service/apiErrors'
import { disableCurrentPerson } from 'common/util/useCurrentPerson'
import { AlertStore } from 'stores/AlertStore'
import { useTranslation } from 'next-i18next'
import { signIn, signOut, useSession } from 'next-auth/react'
import { baseUrl, routes } from 'common/routes'
import Link from 'components/common/Link'
import { useState } from 'react'
import GenericForm from 'components/common/form/GenericForm'
import PasswordField from 'components/common/form/PasswordField'
import SubmitButton from 'components/common/form/SubmitButton'
import { password } from 'common/form/validation'
import * as yup from 'yup'
import CloseIcon from '@mui/icons-material/Close'

const PREFIX = 'DisableUserModal'

const classes = {
  modal: `${PREFIX}-modal`,
  graySpan: `${PREFIX}-graySpan`,
  button: `${PREFIX}-button`,
  close: `${PREFIX}-close`,
}

const StyledModal = styled(Modal)(({ theme }) => ({
  [`& .${classes.modal}`]: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    backgroundColor: '#EEEEEE',
    padding: 20,
    p: 4,
    [theme.breakpoints.down('md')]: {
      width: '70%',
    },
  },
  [`& .${classes.graySpan}`]: {
    fontFamily: 'Lato, sans-serif',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '133.4%',
    color: '#909090',
  },
  [`& .${classes.button}`]: {
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
    },
  },
  [`& .${classes.close}`]: {
    position: 'absolute',
    right: '10px',
  },
}))

const validationSchema: yup.SchemaOf<Pick<UpdateUserAccount, 'password'>> = yup
  .object()
  .defined()
  .shape({
    password: password.required(),
  })

const callbackUrl = `${baseUrl}${routes.index}`

function DisableAccountModal({
  isOpen,
  handleClose,
  person,
}: {
  isOpen: boolean
  handleClose: (data?: Person) => void
  person: UpdatePerson
}) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const { data: session } = useSession()
  const isAuthenticatedByGoogle = session?.user?.iss.includes('google')

  const mutation = useMutation<AxiosResponse<Person>, AxiosError<ApiErrors>, UpdatePerson>({
    mutationFn: disableCurrentPerson(),
    onError: () => AlertStore.show(t('common:alerts.error'), 'error'),
    onSuccess: () => AlertStore.show(t('profile:disableModal.disabled'), 'success'),
  })

  const onSubmit = async (values: Pick<UpdateUserAccount, 'password'>) => {
    try {
      setLoading(true)

      const confirmPassword = await signIn<'credentials'>('credentials', {
        email: person.email,
        password: values.password,
        redirect: false,
      })
      if (confirmPassword?.error) {
        handleClose()
        AlertStore.show(t('auth:alerts.invalid-login'), 'error')
        throw new Error('Invalid login')
      }

      await signOut({ callbackUrl })
      const data = await mutation.mutateAsync({ ...person })

      handleClose(data.data)
    } catch (error) {
      handleClose()
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDisableUser = async () => {
    try {
      await signOut({ callbackUrl })
      const data = await mutation.mutateAsync({ ...person })
      handleClose(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <StyledModal
      open={isOpen}
      onClose={() => handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box className={classes.modal}>
        <IconButton className={classes.close} onClick={() => handleClose()}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h3">
          {t('profile:disableModal.index')}
        </Typography>
        <Typography className={classes.graySpan}>{t('profile:disableModal.sorryMsg')}</Typography>
        <Typography className={classes.graySpan}>
          {t('profile:disableModal.beforeDisableMsg')}
        </Typography>
        <hr />
        <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
          <li className={classes.graySpan}>
            {t('profile:disableModal.deactivateEmails')}
            <Link href="#">{t('profile:disableModal.link')}</Link>.
          </li>
          <li className={classes.graySpan}>
            {t('profile:disableModal.writeUs')}
            <Link href="#">{t('profile:disableModal.link')}</Link>.
          </li>
          <li className={classes.graySpan}>{t('profile:disableModal.irreversibleAction')}</li>
          <li className={classes.graySpan}>{t('profile:disableModal.confirmDisable')}</li>
        </ul>
        {isAuthenticatedByGoogle ? (
          <>
            <Button
              className={classes.button}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => handleClose()}>
              {t('profile:disableModal.saveAccount')}
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              size="medium"
              color="primary"
              style={{ marginLeft: '10px' }}
              onClick={() => handleDisableUser()}>
              {t('profile:disableModal.disableAccount')}
            </Button>
          </>
        ) : (
          <GenericForm
            onSubmit={onSubmit}
            initialValues={{ password: '' }}
            validationSchema={validationSchema}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <PasswordField />
              </Grid>
              <Grid item xs={6}>
                <SubmitButton
                  fullWidth
                  label="profile:disableModal.disableAccount"
                  loading={loading}
                />
              </Grid>
            </Grid>
          </GenericForm>
        )}
      </Box>
    </StyledModal>
  )
}

export default DisableAccountModal
