import ProfilePage from 'components/auth/profile/ProfilePage'
import { securedPropsWithTranslation } from 'middleware/auth/securedProps'

export const getServerSideProps = securedPropsWithTranslation([
  'auth',
  'profile',
  'common',
  'validation',
  'campaigns',
])

export default ProfilePage
