import React, {Component} from 'react';
import {View, ViewStyle, Text, StyleSheet, TextStyle} from 'react-native';

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
}

interface IState {}

enum FormatType {
  BOLD,
  ITALIC,
  UNDERLINE,
  STRIKETHROUGH,
  NEW_LINE,
}

interface Structured {
  pressEvent?: () => void;
  formatting?: FormatType;
  color?: string;
  value: string;
}

export default class MarkupText extends Component<IProps, IState> {
  getFormatted(
    loopText: Structured[],
    structuredText: Structured[],
    regExp: RegExp,
    formatType?: FormatType,
    pressEvent?: [() => void | undefined],
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
              color: undefined,
              value: regExpMatch.input
                ? regExpMatch.input.substring(regExpMatch.index, -1)
                : '',
            });
          }
          partedText.push({
            formatting: formatType,
            pressEvent:
              !!pressEvent && pressEvent.length > eventIndex
                ? pressEvent[eventIndex]
                : undefined,
            color: undefined,
            value: regExpMatch[1],
          });
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

  /**
   * Can be used in the future for getting data like color from new properties.
   */

  // getFormattedWithData(
  //   loopText: Structured[],
  //   structuredText: Structured[],
  //   regExp: RegExp,
  // ) {
  //   let extraIndex = 0;
  //   loopText.forEach((text, index) => {
  //     let partedText: Structured[] = [];

  //     this.loopForRegExp(text.value, partedText, regExp);

  //     structuredText.splice(index + extraIndex, 1, ...partedText);
  //     extraIndex += partedText.length - 1;
  //   });
  // }

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
    const loopText = structuredText.concat([]);
    const boldRegExp = new RegExp('\\[b](.*?)\\[\\/b]');
    this.getFormatted(loopText, structuredText, boldRegExp, FormatType.BOLD);
  }

  getStructuredItalic(structuredText: Structured[]) {
    const loopText = structuredText.concat([]);
    const italicRegExp = new RegExp('\\[i](.*?)\\[\\/i]');
    this.getFormatted(
      loopText,
      structuredText,
      italicRegExp,
      FormatType.ITALIC,
    );
  }

  getStructuredUnderline(structuredText: Structured[]) {
    const loopText = structuredText.concat([]);
    const underlineRegExp = new RegExp('\\[u](.*?)\\[\\/u]');
    this.getFormatted(
      loopText,
      structuredText,
      underlineRegExp,
      FormatType.UNDERLINE,
    );
  }

  getStructuredStrikethrough(structuredText: Structured[]) {
    const loopText = structuredText.concat([]);
    const underlineRegExp = new RegExp('\\[s](.*?)\\[\\/s]');
    this.getFormatted(
      loopText,
      structuredText,
      underlineRegExp,
      FormatType.STRIKETHROUGH,
    );
  }

  getStructuredLink(structuredText: Structured[]) {
    const loopText = structuredText.concat([]);
    const colorRegExp = new RegExp('\\[link](.*?)\\[\\/link]');
    this.getFormatted(
      loopText,
      structuredText,
      colorRegExp,
      undefined,
      this.props.linkEvents,
    );
    return structuredText;
  }

  getStructuredNewLine(structuredText: Structured[]) {
    const loopText = structuredText.concat([]);
    const newLineRegExp = new RegExp('\\[br](.*?)');
    this.getFormatted(
      loopText,
      structuredText,
      newLineRegExp,
      FormatType.NEW_LINE,
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

    return (
      <View style={this.props.style}>
        <Text style={this.props.textStyle}>
          {!!structuredText.length &&
            structuredText.map((data, index) => (
              <Text key={'colored' + index}>
                <Text
                  onPress={data.pressEvent}
                  style={[
                    {
                      color: !data.color
                        ? this.props.regularColor || 'black'
                        : data.color,
                      fontWeight:
                        data.formatting === FormatType.BOLD ? 'bold' : 'normal',
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
                {data.formatting === FormatType.NEW_LINE && <Text>{'\n'}</Text>}
              </Text>
            ))}
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
