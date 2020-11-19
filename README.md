# ghs-docker-run
The `timharris777/gha-docker-run` action is used to run a docker container from a private or publice registry with the current workspace mapped and github actions env vars available. It also fixes permissions after it runs so that created files are owned by `actions:actions`.

# Usage

This action can be run on any GitHub hosted runners or self-hosted runners as long as `bash` is available as a shell.

```
steps:
  - uses: timharris777/gha-docker-run@master
    with: 
      image: lambci/lambda:build-python3.8
      run: |
        touch testing123.txt
        ls -la
```

# Inputs

### image:
The name of the docker image to run
( **required** )

--
### run:
Bash commands to run on docker image. Note that this overrides entrypoint of docker image to /bin/bash.

--
### user:
The user to run the docker image as.

--
### registry:
The private docker registry to login to.

--
### username:
The username with which to login to the private docker registry.

--
### password:
The password with which to login to the private docker registry.

--

For more details see: [action.yaml](action.yaml)

# License

[Apache License 2.0](LICENSE)
