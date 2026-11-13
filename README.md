# rn-scrollview-frame-change-repro

![Build](https://github.com/Elehiggle/rn-scrollview-frame-change-repro/workflows/Pre%20Merge%20Checks/badge.svg)

Reproducer for a React Native iOS issue (New Architecture): when a `ScrollView`'s frame changes while a finger holds the content pulled past the top, `contentOffset.y` is set to 0.

Only `ReproducerApp/App.tsx` differs from the [reproducer template](https://github.com/react-native-community/reproducer-react-native) (React Native 0.88.1).

## Run

```bash
cd ReproducerApp
yarn install
bundle install
(cd ios && bundle exec pod install)
yarn ios
```

## Steps

1. The footer under the list changes its height between 80 and 140 every second. This changes the height of the `ScrollView` above it.
2. With the list at the top, pull it down slowly and keep the finger down for a few seconds. The top line shows a negative `y` and `finger down`.
3. Each time the footer changes height, the list jumps toward the top. The log shows `scroll y 0.0`, then about half of the value before.
4. Turn on "resize content instead (control)" and repeat step 2. The spacer at the end of the content now changes height instead of the footer. The offset is kept.

The app logs each footer change and each `onScroll` offset with a timestamp. Read them in Metro's terminal or with
`xcrun simctl spawn booted log stream --predicate 'subsystem == "com.facebook.react.log"'`.

Recordings from an iPhone 18 Pro simulator on iOS 27.2 are in [`evidence/`](evidence). The drags in them are XCTest-synthesised pans, and the clips show no touch indicator.

# How to use this Reproducer

This project has been created with `npx @react-native-community/cli init` and is a vanilla React Native app.

> [!IMPORTANT]  
> Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/set-up-your-environment) so that you have a working environment locally.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

First, make sure you install dependencies with:

```bash
cd ios && bundle install && bundle exec pod install
```

Then you can run the iOS app with:

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!
