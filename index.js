const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

async function run() {
    try {
        // `who-to-greet` input defined in action metadata file
        const image = core.getInput('image');
        const entrypoint = core.getInput('entrypoint');
        const commands = core.getInput('commands');
        const user = core.getInput('user');
        const registry = core.getInput('registry');
        const username = core.getInput('username');
        const password = core.getInput('password');
        if (!!password.trim()) {
            core.setSecret(password)
        }

        context = github.context

        console.log(JSON.stringify(context))
    
        core.startGroup('docker login');
        var login_cmd;
        if (!!username.trim() && !!password.trim()) {
            if (!!registry.trim()) {
                login_cmd=(`docker login ${registry} -u ${username} -p ${password}`);
            } else {
                login_cmd=(`docker login ${registry} -u ${username} -p ${password}`);
            }
            await exec.exec(login_cmd)
        } else {
            console.log('Username and password not provided. Skipping "docker login" step.')
        }
        core.endGroup()

        core.startGroup('docker run');
        var run_cmd;
        run_cmd=`docker run --rm --env-file ${process.env.GITHUB_ENV} --workdir /github/workspace -v ${process.env.PWD}}:/github/workspace -v /var/run/docker.sock:/var/run/docker.sock`;
        // run_cmd=`docker run --rm ${setDockerEnvVars()} --workdir /github/workspace -v ${process.env.PWD}}:/github/workspace -v /var/run/docker.sock:/var/run/docker.sock`;
        if (!!user.trim()) { 
            run_cmd=`${run_cmd} --user ${user}`
        }
        if (!!entrypoint.trim()) {
            run_cmd=`${run_cmd} --entrypoint ${entrypoint}`
        }
        if (!!image.trim()) {
            run_cmd=`${run_cmd} ${image}`;
        }
        if (!!commands.trim()) {
            run_cmd=`${run_cmd} ${commands}`
        }
        console.log(`Running: ${run_cmd}`)
        await exec.exec(run_cmd)
        core.endGroup()

        core.startGroup('fixing permissions');
        await exec.exec("sudo chown actions:actions .")
        core.endGroup
        
    } catch (error) {
        core.setFailed(error.message);
    }
}

function setDockerEnvVars() {
    var env_vars = [];
    var excluded_env_vars=['PAT','INPUT_COMMANDS','INPUT_IMAGE','INPUT_USERNAME','INPUT_PASSWORD','INPUT_REGISTRY']
    for (let i in process.env) { 
        if (!!process.env[i].trim() && !excluded_env_vars.includes(i)) {
            env_vars.push(`-e ${i}=${process.env[i]}`)
        }
    }
    return env_vars.join(' ')
}
    
run();