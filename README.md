# rn-scrollview-frame-change-repro

![Build](https://github.com/Elehiggle/rn-scrollview-frame-change-repro/workflows/Pre%20Merge%20Checks/badge.svg)

Reproducer for a React Native iOS issue (New Architecture): with `contentInsetAdjustmentBehavior="automatic"`, `scrollTo()` and `scrollToEnd()` work from `contentInset`, not `adjustedContentInset`: `scrollTo()` clamps to it and `scrollToEnd()` builds its target from it. See [react-native#57522](https://github.com/react/react-native/issues/57522).

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

`T` is the top safe-area inset (62 on an iPhone 18 Pro).

1. At rest the panel shows `y = -62.0` and row 1 sits below the status bar.
2. Scroll down a little, then tap `scrollTo({y: -62})`. The list stops at `y = 0.0`, with row 1 under the status bar. The animated button ends at the same place.
3. Turn on `scrollToOverflowEnabled` and tap `scrollTo({y: -62})` again. The list stops at `y = -62.0`.
4. Scroll to the very end by hand: `y = 560.0`. Tap `scrollToEnd()`: the list moves back to `y = 526.0`. The switch does not change this.

Recordings from an iPhone 18 Pro simulator on iOS 27.2 are in [`evidence/`](evidence).

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
