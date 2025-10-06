// import Reactotron from "reactotron-react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// Reactotron.setAsyncStorageHandler(AsyncStorage)
//     .configure({
//         name: "React Native Demo",
//     })
//     .useReactNative({
//         asyncStorage: false, // there are more options to the async storage.
//         networking: {
//             // optionally, you can turn it off with false.
//             ignoreUrls: /symbolicate/,
//         },
//         editor: false, // there are more options to editor
//         errors: { veto: (stackFrame) => false }, // or turn it off with false
//         overlay: false, // just turning off overlay
//     })
//     .connect();

import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  // .configure({ host: '192.168.1.183' }) // controls connection & communication settings
  .configure({ name: 'LegalConnect' })
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

export default reactotron;
console.tron = reactotron;
