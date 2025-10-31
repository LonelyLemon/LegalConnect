import Config from 'react-native-config';
interface EnvConfig {
  authUrl: string;
  baseUrl: string;
}

const envConfig: EnvConfig = {
  authUrl: Config.AUTH_URL || 'http://localhost:8000',
  // baseUrl: Config.BASE_URL || 'https://legal-connect-xi.vercel.app/',
  // baseUrl: Config.BASE_URL || 'http://10.0.2.2:8000/',
  // baseUrl: Config.BASE_URL || 'http://192.168.10.75:8000/',
  baseUrl: Config.BASE_URL || 'https://legalconnect-production.up.railway.app/',
};
export default envConfig;
