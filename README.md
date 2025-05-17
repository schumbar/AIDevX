# AIDevX

Welcome to AIDevX, a platform for software development agents powered by AI.

AIDevX agents can do anything a human developer can: modify code, run commands, browse the web,
call APIs, and yes—even copy code snippets from StackOverflow.

## 💻 Running AIDevX Locally

AIDevX can also run on your local system using Docker.
See the Running AIDevX guide for system requirements and more information.

> [!WARNING]
> On a public network? See our Hardened Docker Installation Guide
> to secure your deployment by restricting network binding and implementing additional security measures.

```bash
docker pull aidevx/runtime:latest

docker run -it --rm --pull=always \
    -e SANDBOX_RUNTIME_CONTAINER_IMAGE=aidevx/runtime:latest \
    -e LOG_ALL_EVENTS=true \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v ~/.aidevx-state:/.aidevx-state \
    -p 3000:3000 \
    --add-host host.docker.internal:host-gateway \
    --name aidevx-app \
    aidevx/aidevx:latest
```

You'll find AIDevX running at [http://localhost:3000](http://localhost:3000)!

When you open the application, you'll be asked to choose an LLM provider and add an API key.
[Anthropic's Claude 3.7 Sonnet](https://www.anthropic.com/api) (`anthropic/claude-3-7-sonnet-20250219`)
works best, but you have many options.

## 💡 Other ways to run AIDevX

> [!CAUTION]
> AIDevX is meant to be run by a single user on their local workstation.
> It is not appropriate for multi-tenant deployments where multiple users share the same instance. There is no built-in authentication, isolation, or scalability.
>
> If you're interested in running AIDevX in a multi-tenant environment, please
> [get in touch with us](https://docs.google.com/forms/d/e/1FAIpQLSet3VbGaz8z32gW9Wm-Grl4jpt5WgMXPgJ4EDPVmCETCBpJtQ/viewform)
> for advanced deployment options.

You can also connect AIDevX to your local filesystem,
run AIDevX in a scriptable headless mode,
interact with it via a friendly CLI,
or run it on tagged issues with a github action.

Visit the AIDevX documentation for more information and setup instructions.

If you want to modify the AIDevX source code, check out the Development guide.

Having issues? The Troubleshooting Guide can help.

## 📖 Documentation

To learn more about the project, and for tips on using AIDevX,
check out our documentation.

There you'll find resources on how to use different LLM providers,
troubleshooting resources, and advanced configuration options.

### Custom Scripts

AIDevX supports custom scripts that run at different points in the runtime lifecycle:

- **setup.sh**: Place this script in the `.aidevx` directory of your repository to run custom setup commands when the runtime initializes.
- **pre-commit.sh**: Place this script in the `.aidevx` directory to add a custom git pre-commit hook that runs before each commit. This can be used to enforce code quality standards, run tests, or perform other checks before allowing commits.

## 📜 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

## 🙏 Acknowledgements

AIDevX is built by a large number of contributors, and every contribution is greatly appreciated! We also build upon other open source projects, and we are deeply thankful for their work.

For a list of open source projects and licenses used in AIDevX, please see our [CREDITS.md](./CREDITS.md) file.