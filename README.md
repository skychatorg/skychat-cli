# SkyChatCLI

Command-line interface to connect to your favorite SkyChat instance

<img src="doc/capture.png" width="100%" />

## Install

```bash
npm i -g skychat-cli
```

## Use

You need to provide:

-   The host you are connecting to (eg `some-skychat.com`) where a SkyChat instance is running
-   Your credentials (user and password) (only if you want to connect to an existing account)

Example connecting as a guest:

```bash
skychat-cli -h some-skychat.com
```

Example connecting with an existing account:

```bash
SKYCHAT_USER=user SKYCHAT_PASSWORD=password skychat-cli -h some-skychat.com
```

Once you connected with a user + password once, you will automatically re-use your auth token the next time you login

```bash
# Initial connection: You need to provide user + password
SKYCHAT_USER=user SKYCHAT_PASSWORD=password skychat-cli -h some-skychat.com

# Second connection: Only pass the host, your auth token will be re-used
skychat-cli -h some-skychat.com
```

## Tips

1. All options can be passed either through environment or CLI args

    ```bash
    # All CLI args:
    skychat-cli -h some-skychat.com -u user -p password

    # All env:
    SKYCHAT_HOST=some-skychat.com SKYCHAT_USER=user SKYCHAT_PASSWORD=password skychat-cli
    ```

2. In order not to have to specify the host each time you want to connect, you can add `export SKYCHAT_HOST=some-skychat.com` to your `.bashrc` file:

    ```bash
    echo 'export SKYCHAT_HOST="some-skychat.com"' >> ~/.bashrc
    ```
