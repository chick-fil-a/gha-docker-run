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
        
        var run_cmd;
    
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
        run_cmd=`docker run --rm --env-file $GITHUB_ENV --workdir /github/workspace -v $PWD:/github/workspace -v /var/run/docker.sock:/var/run/docker.sock`;
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
    
run();