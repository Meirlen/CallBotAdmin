# Установка на сервер
* Авторизовываемся по ssh на сервере
* Клонируем репозиторий через git clone
* Открываем файл firebaseConfig.js.example и заменяем firebaseConfig на своё значение, сохраняем файл под названием firebaseConfig.js
* Открываем файл conf.ts.example и заменяем GRPC_HOST на ip-сервера/домен, сохраняем файл под названием conf.ts
* Для тестового сервера выполняем команду docker-compose up --build -d
* Настраиваем nginx для проксирования api и доступа по 80-му порту [пример](./nginx.md) 

# Авторизация
firebase login

# Деплой
firebase deploy

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
If neccesary you need instal npm
### `npm install`

In the project directory, you can run:
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Proto generation

```
protoc -I ./src/proto/order ./src/proto/order/*.proto --js_out=import_style=commonjs:"./src/protoout/order" --grpc-web_out=import_style=commonjs,mode=grpcwebtext:"./src/protoout/order"
```

## grpc proxy
```
https://github.com/improbable-eng/grpc-web/releases
```
* run grpc proxy on windows
```
grpcwebproxy-v0.15.0-win64.exe  --backend_addr=localhost:9090 --backend_tls_noverify --run_tls_server=false --allow_all_origins
```
