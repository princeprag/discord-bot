import { config } from "dotenv";
import chai from "chai";
import sinonChai from "sinon-chai";
import { afterEach } from "mocha";

const TEST_ENV_FILE = process.env.DOT_CONFIG_PATH ?? "./test.env";
const DEBUG = process.env.DOT_CONFIG_DEBUG === "true" ? true : false;

config({ path: TEST_ENV_FILE, debug: DEBUG });

chai.use(sinonChai);
