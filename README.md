## Usage

Install the packages.

```bash
$ npm i
```

Install the requirements.

```bash
$ npm run dev:requirements
```

## Tips:

-   This project separates `prettier` just for formatting and `eslint` just for linting, as it's advised by the developers. That's why I don't use `eslint-plugin-prettier`

-   When you commit something, `husky`, `mrm` and `lint-stage` are set to run `prettier`, `eslint` and `jest`.<br>
    This will fix everything and let you know if you forgot about any error.<br>
    It will also run tests that were created or modified.

-   The `error-handler.middleware` will handle all errors, this also includes any unknown routes by the `openapi.yaml` and the errors thrown by the classes `DomainError` and `AxiosRequestError`.<br>
    When `NODE_ENV` is set to `production`. It will NOT interfere with the logs, but will change the error response to:<br>
    `http status 500` and the body response to: `Something bad happened`<br>
    Unless it's a `DomainError` that the client must know about!

-   Unknown exceptions by the application, will use the Erlang's let it crash philosophy.<br>
    Basically it lets the app crash so the orchestrator can restart the application.<br>
    But how this really works?<br>
    First the app will stop receiving request, then finish the requests that were already in progress and gracefully shuts down everything.<br>
    This approach improves system reliability.<br>
    If you're on Kubernetes, you can use Ingress or other load balancer strategies for your application.

-   There's a `rateLimiter` method configured to limit request per user's ip.<br>
    You can delete it if you decide to use this project as a private API.

-   dotenv is set just for Jest.<br>
    For development it uses `--env-file ./environments/.env`

-   Inside the `tsconfig.json` under `paths: {}` you can set custom paths.<br>
    You don't need to set them anywhere else, this project already does that for you.

-   There are two debuggers configured with auto reload to facilitate your workflow.<br>
    So you don't need to keep restarting your debugger manually.<br>
    One for Node and the other for Jest.

-   You can run/debug just one test at a time with the extension `Jest Runner` from the author `firsttris `<br>
    The project is already set to run it without any problems.<br>
    PS: I've found a bug in this extension on linux, but the bug just occurs if you set your `it(``, () => {})` with template strings that has multiple lines. The bug happens when the first line has a similar description with another test before the line breaks.<br>
    Besides that it works great!

## WYP

-   Request timeout

-   Unit tests
