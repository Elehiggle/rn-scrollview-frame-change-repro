/**
 * iOS, New Architecture: a frame change of a ScrollView while the finger
 * holds it pulled past its top (negative contentOffset.y) sets the offset
 * to 0 in one step. A content size change in the same situation keeps the
 * offset (control mode).
 *
 * Steps: pull the list down past its top and keep the finger down for a few
 * seconds. The footer below the list flips its height every second, which
 * changes the height of the ScrollView above it.
 */

import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ROWS = Array.from({ length: 30 }, (_, i) => i + 1);

function Repro() {
  const [tall, setTall] = useState(false);
  const [control, setControl] = useState(false);
  const [y, setY] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTall(t => !t), 1000);
    return () => clearInterval(id);
  }, []);

  const flipping = tall ? 140 : 80;
  const footerHeight = control ? 80 : flipping;
  const spacerHeight = control ? flipping : 80;

  useEffect(() => {
    console.log(
      Date.now(),
      control ? 'flip content spacer' : 'flip footer (frame)',
      flipping,
    );
  }, [flipping, control]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        <Text style={styles.readout}>
          y = {y.toFixed(1)} {dragging ? 'finger down' : ''}
        </Text>
        <Text>resize content instead (control)</Text>
        <Switch value={control} onValueChange={setControl} />
      </View>
      <ScrollView
        style={styles.list}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          console.log(Date.now(), 'drag begin');
          setDragging(true);
        }}
        onScrollEndDrag={() => {
          console.log(Date.now(), 'drag end');
          setDragging(false);
        }}
        onScroll={e => {
          const offsetY = e.nativeEvent.contentOffset.y;
          console.log(Date.now(), 'scroll y', offsetY.toFixed(1));
          setY(offsetY);
        }}
      >
        {ROWS.map(n => (
          <Text key={n} style={styles.row}>
            Row {n}
          </Text>
        ))}
        <View style={[styles.spacer, { height: spacerHeight }]} />
      </ScrollView>
      <View style={[styles.footer, { height: footerHeight }]}>
        <Text>footer {footerHeight}</Text>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Repro />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'white' },
  top: { padding: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  readout: { width: '100%', fontSize: 20, fontVariant: ['tabular-nums'] },
  list: { flex: 1, backgroundColor: '#eef' },
  row: { padding: 12, fontSize: 18, borderBottomWidth: 1, borderColor: '#ccd' },
  spacer: { backgroundColor: '#fc9' },
  footer: { backgroundColor: '#9cf', alignItems: 'center', justifyContent: 'center' },
});
