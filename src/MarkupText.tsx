import React, {Component} from 'react';
import {
  View,
  ViewStyle,
  Text,
  StyleSheet,
  TextStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';

interface IProps {
  textStyle?: TextStyle;
  regularTextStyle?: TextStyle;
  coloredTextStyle?: TextStyle;
  boldTextStyle?: TextStyle;
  italicTextStyle?: TextStyle;
  underlineTextStyle?: TextStyle;
  strikethroughTextStyle?: TextStyle;
  linkTextStyle?: TextStyle;
  style?: ViewStyle;
  regularColor?: string;
  linkEvents?: [() => void];
  imageSources?: ImageSourcePropType[];
}

interface IState {}

enum FormatType {
  BOLD,
  ITALIC,
  UNDERLINE,
  STRIKETHROUGH,
  LINK,
  NEW_LINE,
  IMAGE,
  LINKED_IMAGE,
}

interface Structured {
  pressEvent?: () => void;
  imageSource?: ImageSourcePropType;
  formatting?: FormatType;
  color?: string;
  value: string;
  width?: number;
  height?: number;
  resizeMode?:
    | 'cover'
    | 'contain'
    | 'stretch'
    | 'repeat'
    | 'center'
    | undefined;
}

export default class MarkupText extends Component<IProps, IState> {
  getFormatted(
    loopText: Structured[],
    structuredText: Structured[],
    regExp: RegExp,
    formatType?: FormatType,
    pressEvent?: [() => void | undefined],
    imageSource?: ImageSourcePropType[],
  ) {
    let eventIndex = 0;
    let extraIndex = 0;
    loopText.forEach((text, index) => {
      let partedText: Structured[] = [];
      let colorText = text.value;

      while (colorText.length) {
        const regExpMatch = colorText.match(regExp);
        if (regExpMatch) {
          if (regExpMatch.index !== undefined) {
            partedText.push({
              value: regExpMatch.input
                ? regExpMatch.input.substring(regExpMatch.index, -1)
                : '',
            });
          }

          let newStructured: Structured = {
            formatting: formatType,
            value: regExpMatch[1],
          };

          this.setCustomProperties(
            newStructured,
            regExpMatch,
            eventIndex,
            formatType,
            pressEvent,
            imageSource,
          );

          partedText.push(newStructured);
          eventIndex++;

          colorText = colorText.substring(
            (regExpMatch.index || 0) + regExpMatch[0].length,
          );
        } else {
          text.value = colorText;
          partedText.push(text);
          colorText = '';
        }
      }

      structuredText.splice(index + extraIndex, 1, ...partedText);
      extraIndex += partedText.length - 1;
    });
  }

  setCustomProperties(
    newStructured: Structured,
    regExpMatch: RegExpMatchArray,
    eventIndex: number,
    formatType?: FormatType,
    pressEvent?: [() => void | undefined],
    imageSource?: ImageSourcePropType[],
  ) {
    if (formatType === FormatType.IMAGE) {
      newStructured.width = Number(regExpMatch[2]);
      newStructured.height = Number(regExpMatch[3]);
      newStructured.resizeMode =
        regExpMatch[4] === 'undefined'
          ? undefined
          : (regExpMatch[4] as
              | 'cover'
              | 'contain'
              | 'stretch'
              | 'repeat'
              | 'center');
    } else if (formatType === FormatType.LINKED_IMAGE) {
      newStructured.width = Number(regExpMatch[1]);
      newStructured.height = Number(regExpMatch[2]);
      newStructured.resizeMode =
        regExpMatch[3] === 'undefined'
          ? undefined
          : (regExpMatch[3] as
              | 'cover'
              | 'contain'
              | 'stretch'
              | 'repeat'
              | 'center');

      newStructured.imageSource =
        !!imageSource && imageSource.length > eventIndex
          ? imageSource[eventIndex]
          : undefined;
    } else if (formatType === FormatType.LINK) {
      newStructured.pressEvent =
        !!pressEvent && pressEvent.length > eventIndex
          ? pressEvent[eventIndex]
          : undefined;
    }
  }

  loopForRegExp(text: string, array: Structured[], regExp: RegExp) {
    while (text.length) {
      const regExpMatch = text.match(regExp);

      if (regExpMatch) {
        if (regExpMatch.index && regExpMatch.index > 0) {
          array.push({
            color: undefined,
            value: text.substring(regExpMatch.index, -1),
          });
        }
        array.push({
          color: regExpMatch[1],
          value: regExpMatch[2],
        });

        text = text.substring((regExpMatch.index || 0) + regExpMatch[0].length);
      } else {
        array.push({value: text});
        text = '';
      }
    }
  }

  getStructuredColor(colorText: string) {
    let structuredText: {
      color?: string;
      value: string;
    }[] = [];
    const colorRegExp = new RegExp('\\[color=(.*?)](.*?)\\[\\/color]');
    this.loopForRegExp(colorText, structuredText, colorRegExp);
    return structuredText;
  }

  getStructuredBold(structuredText: Structured[]) {
    const loopText = [...structuredText];
    const boldRegExp = new RegExp('\\[b](.*?)\\[\\/b]');
    this.getFormatted(loopText, structuredText, boldRegExp, FormatType.BOLD);
  }

  getStructuredItalic(structuredText: Structured[]) {
    const loopText = [...structuredText];
    const italicRegExp = new RegExp('\\[i](.*?)\\[\\/i]');
    this.getFormatted(
      loopText,
      structuredText,
      italicRegExp,
      FormatType.ITALIC,
    );
  }

  getStructuredUnderline(structuredText: Structured[]) {
    const loopText = [...structuredText];
    const underlineRegExp = new RegExp('\\[u](.*?)\\[\\/u]');
    this.getFormatted(
      loopText,
      structuredText,
      underlineRegExp,
      FormatType.UNDERLINE,
    );
  }

  getStructuredStrikethrough(structuredText: Structured[]) {
    const loopText = [...structuredText];
    const underlineRegExp = new RegExp('\\[s](.*?)\\[\\/s]');
    this.getFormatted(
      loopText,
      structuredText,
      underlineRegExp,
      FormatType.STRIKETHROUGH,
    );
  }

  getStructuredLink(structuredText: Structured[]) {
    const loopText = [...structuredText];
    const colorRegExp = new RegExp('\\[link](.*?)\\[\\/link]');
    this.getFormatted(
      loopText,
      structuredText,
      colorRegExp,
      FormatType.LINK,
      this.props.linkEvents,
    );
  }

  getStructuredNewLine(structuredText: Structured[]) {
    const loopText = [...structuredText];
    const newLineRegExp = new RegExp('\\[br](.*?)');
    this.getFormatted(
      loopText,
      structuredText,
      newLineRegExp,
      FormatType.NEW_LINE,
    );
  }

  getStructuredImage(structuredText: Structured[]) {
    const loopText = [...structuredText];
    const newLineRegExp = new RegExp(
      '\\[image=(.*?) width=(.*?) height=(.*?) resizeMode=(.*?)\\/]',
    );
    this.getFormatted(
      loopText,
      structuredText,
      newLineRegExp,
      FormatType.IMAGE,
    );
  }

  getStructuredLinkedImage(structuredText: Structured[]) {
    const loopText = [...structuredText];
    const newLineRegExp = new RegExp(
      '\\[linkedImage width=(.*?) height=(.*?) resizeMode=(.*?)\\/]',
    );
    this.getFormatted(
      loopText,
      structuredText,
      newLineRegExp,
      FormatType.LINKED_IMAGE,
      undefined,
      this.props.imageSources,
    );
  }

  render() {
    let colorText = this.props.children ? this.props.children.toString() : '';

    let structuredText: Structured[] = this.getStructuredColor(colorText);
    this.getStructuredBold(structuredText);
    this.getStructuredItalic(structuredText);
    this.getStructuredUnderline(structuredText);
    this.getStructuredStrikethrough(structuredText);
    this.getStructuredLink(structuredText);
    this.getStructuredNewLine(structuredText);
    this.getStructuredImage(structuredText);
    this.getStructuredLinkedImage(structuredText);

    return (
      <View style={this.props.style}>
        <Text style={this.props.textStyle}>
          {!!structuredText.length &&
            structuredText.map((data, index) =>
              data.formatting === FormatType.IMAGE ||
              data.formatting === FormatType.LINKED_IMAGE ? (
                <Image
                  key={'colored' + index}
                  source={
                    data.formatting === FormatType.LINKED_IMAGE
                      ? data.imageSource!
                      : {uri: data.value}
                  }
                  style={{
                    width: data.width,
                    height: data.height,
                    resizeMode: data.resizeMode,
                  }}
                />
              ) : (
                <Text key={'colored' + index}>
                  <Text
                    onPress={data.pressEvent}
                    style={[
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        color: !data.color
                          ? this.props.regularColor || 'black'
                          : data.color,
                        fontWeight:
                          data.formatting === FormatType.BOLD
                            ? 'bold'
                            : 'normal',
                        fontStyle:
                          data.formatting === FormatType.ITALIC
                            ? 'italic'
                            : 'normal',
                        textDecorationLine:
                          data.formatting === FormatType.UNDERLINE
                            ? 'underline'
                            : data.formatting === FormatType.STRIKETHROUGH
                            ? 'line-through'
                            : 'none',
                      },
                      styles.regularText,
                      !data.color
                        ? this.props.regularTextStyle
                        : this.props.coloredTextStyle,
                      data.formatting === FormatType.BOLD
                        ? this.props.boldTextStyle
                        : undefined,
                      data.formatting === FormatType.ITALIC
                        ? this.props.italicTextStyle
                        : undefined,
                      data.formatting === FormatType.UNDERLINE
                        ? this.props.underlineTextStyle
                        : undefined,
                      data.formatting === FormatType.STRIKETHROUGH
                        ? this.props.strikethroughTextStyle
                        : undefined,
                      data.pressEvent ? this.props.linkTextStyle : undefined,
                    ]}>
                    {data.value}
                  </Text>
                  {data.formatting === FormatType.NEW_LINE && (
                    <Text>{'\n'}</Text>
                  )}
                </Text>
              ),
            )}
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  regularText: {
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.21,
  },
});
