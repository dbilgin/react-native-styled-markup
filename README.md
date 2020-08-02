<a href="https://www.npmjs.com/package/react-native-styled-markup">
  <img alt="npm" src="https://img.shields.io/npm/v/react-native-styled-markup">
</a>

# react-native-styled-markup
Markup text with formatting capability for react native.

## Usage

Check it out on [expo.io](https://snack.expo.io/@dbilgin/markuptext)

```
import MarkupText from 'react-native-styled-markup';

<MarkupText
  linkEvents={[
    () => alert('The first link is pressed!'),
    () => alert('The second link is pressed!'),
  ]}
  linkTextStyle={{
    textDecorationLine: 'underline',
    color: 'darkblue',
    fontWeight: 'bold',
  }}
  imageSources={[require('./150.png')]}>
  [b]Lorem ipsum dolor[/b] sit amet, consectetur
  [color=#FA5544]adipiscing elit, sed do eiusmod[/color] tempor
  incididunt ut [u]labore et dolore magna[/u] aliqua. Ut enim ad
  [s]minim veniam, quis[/s] nostrud exercitation
  [image=https://via.placeholder.com/150 width=50 height=20
  resizeMode=contain/] ullamco laboris nisi ut [linkedImage width=50
  height=20 resizeMode=contain/] aliquip ex ea commodo consequat. And
  here is a [link]link[/link]! And another [link]link[/link]!
  sit[br]amet,[br]consectetur
</MarkupText>
```

![MarkupText](https://github.com/dbilgin/images/blob/master/MarkupText.png "MarkupText")

## Properties


| Property  | Type                   | Default | Description                                  |
|-----------|------------------------|---------|----------------------------------------------|
| textStyle | TextStyle \| undefined | -       | The text style for the parent Text component |
| regularTextStyle | TextStyle \| undefined | ```{ fontSize: 14, lineHeight: 22, letterSpacing: -0.21, color: 'black' }``` | The text style for the unformatted texts |
| coloredTextStyle | TextStyle \| undefined | - | The text style for the colored texts |
| boldTextStyle | TextStyle \| undefined | ```{ fontWeight: 'bold' }``` | The text style for the bold texts |
| italicTextStyle | TextStyle \| undefined | ```{ fontStyle: 'italic' }``` | The text style for the italic texts |
| underlineTextStyle | TextStyle \| undefined | ```{ textDecorationLine: 'underline' }``` | The text style for the underlined texts |
| strikethroughTextStyle | TextStyle \| undefined | ```{ textDecorationLine: 'line-through' }``` | The text style for the texts with strikethrough |
| linkTextStyle | TextStyle \| undefined | - | The text style for the texts with links |
| style | ViewStyle \| undefined | - | Container View style |
| regularColor | string \| undefined | black | Default color for the text |
| linkEvents | [() => void] \| undefined | - | When [link] is used in a text, events can be attached to these partial texts with linkEvents through their indices. |
| imageSources | ImageSourcePropType[] \| undefined | - | When [linkedImage] is used in a text, local images can be attached to these partial texts with imageSources through their indices. |
