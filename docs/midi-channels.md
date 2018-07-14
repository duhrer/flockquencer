# Configuring MIDI Channels

![MIDI Channel Selection Interface](../src/images/midi-channel-mode.svg)

The Flockquencer provides an interface for determining which MIDI channel outgoing notes will be sent to.  This
interface can be opened using the right-most circular button in the top row of buttons.  This button is always lit
when in MIDI channel selection mode.

The red lights in this mode divide the grid into three rows of sixteen pads, which can be used to set the MIDI channel
(1-16) as follows:

1. The top two rows set the channel used when playing individual notes or arpeggiating.  This is set to channel 1 by
   default.
2. The bottom two rows set the channel used for all sequencers that do not have a specific channel set.  This is set to
   channel 10 by default.
3. By pressing a button in the rightmost column, you can use the middle rows to configure a specific channel for a
   pattern.  Notes will be sent on this channel when the pattern is used as a sequence.
