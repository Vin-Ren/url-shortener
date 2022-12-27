import envVars from './envVars'; // Import this first, this calls dotenv.config
import app from './app';

const { BACKEND_HOST, BACKEND_PORT } = envVars;

app.listen(BACKEND_PORT, BACKEND_HOST, () => console.log(`Backend listening on ${BACKEND_HOST}:${BACKEND_PORT}`))
