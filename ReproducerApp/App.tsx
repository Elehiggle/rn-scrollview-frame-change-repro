/**
 * iOS, New Architecture: with contentInsetAdjustmentBehavior="automatic",
 * scrollTo() and scrollToEnd() clamp against contentInset instead of
 * adjustedContentInset.
 *
 * At rest at the top the offset is -T (T = top safe-area inset).
 * scrollTo({y: -T}) should return to exactly that position but lands at 0,
 * with the first row under the status bar. With scrollToOverflowEnabled it
 * lands at -T. scrollToEnd() stops short of the end the user reaches by hand.
 */

import { useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const ROWS = Array.from({ length: 30 }, (_, i) => i + 1);

function Repro() {
  const insets = useSafeAreaInsets();
  const T = insets.top;
  const ref = useRef<ScrollView>(null);
  const [y, setY] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [overflow, setOverflow] = useState(false);

  const run = (label: string, action: () => void) => {
    console.log(Date.now(), label, 'overflow', overflow);
    action();
  };

  return (
    <View style={styles.root}>
      <ScrollView
        ref={ref}
        contentInsetAdjustmentBehavior="automatic"
        scrollToOverflowEnabled={overflow}
        scrollEventThrottle={16}
        onLayout={e => setLayoutHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(_, h) => setContentHeight(h)}
        onScroll={e => {
          const offsetY = e.nativeEvent.contentOffset.y;
          console.log(Date.now(), 'scroll y', offsetY.toFixed(1));
          setY(offsetY);
        }}
      >
        {ROWS.map(n => (
          <Text key={n} style={styles.row}>
            Row {n}
            {n === 1 ? ' (first)' : n === ROWS.length ? ' (last)' : ''}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.panel}>
        <Text style={styles.readout}>y = {y.toFixed(1)}</Text>
        <Text>
          T = {T}, bottom inset = {insets.bottom}
        </Text>
        <Text>
          layout h = {layoutHeight.toFixed(1)}, content h = {contentHeight.toFixed(1)}
        </Text>
        <Button
          title={`scrollTo({y: -${T}})`}
          onPress={() =>
            run('scrollTo', () => ref.current?.scrollTo({ y: -T, animated: false }))
          }
        />
        <Button
          title={`scrollTo({y: -${T}, animated: true})`}
          onPress={() =>
            run('scrollTo animated', () => ref.current?.scrollTo({ y: -T, animated: true }))
          }
        />
        <Button
          title="scrollToEnd()"
          onPress={() =>
            run('scrollToEnd', () => ref.current?.scrollToEnd({ animated: false }))
          }
        />
        <View style={styles.switchRow}>
          <Text>scrollToOverflowEnabled</Text>
          <Switch value={overflow} onValueChange={setOverflow} />
        </View>
      </View>
    </View>
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
  row: { padding: 12, fontSize: 18, borderBottomWidth: 1, borderColor: '#ccd', backgroundColor: '#eef' },
  panel: {
    position: 'absolute',
    top: '40%',
    left: 16,
    right: 16,
    padding: 8,
    gap: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 240, 200, 0.95)',
  },
  readout: { fontSize: 20, fontVariant: ['tabular-nums'] },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
