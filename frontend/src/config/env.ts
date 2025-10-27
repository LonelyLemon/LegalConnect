import Config from 'react-native-config';
interface EnvConfig {
  authUrl: string;
  baseUrl: string;
}

const envConfig: EnvConfig = {
  authUrl: Config.AUTH_URL || 'http://localhost:3000',
  baseUrl: Config.BASE_URL || 'https://legal-connect-xi.vercel.app/',
};
export default envConfig;
