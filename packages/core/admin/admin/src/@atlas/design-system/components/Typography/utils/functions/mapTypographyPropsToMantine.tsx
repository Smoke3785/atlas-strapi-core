// Styles
import styles from '../../typography.module.scss';
import clsx from 'clsx';

// Types
import type { TypographyProps, TextProps } from '../../Typography';
import { DefaultTheme } from 'styled-components';
type TypographyPropsSansChildren = Omit<TypographyProps, 'children'>;

const simpleMaps: Record<string, string> = {
  textDecoration: 'td',
  textTransform: 'tt',
  textAlign: 'align', // Check this one...
  fontSize: 'size',
  as: 'component',
  fontWeight: 'fw',
  lineHeight: 'lh',
};

export default function mapTypographyPropsToMantine(
  { ...props }: TypographyPropsSansChildren,
  theme: DefaultTheme
): TextProps {
  let og: Record<string, any> = { ...props };
  const mappedProps: Record<string, any> = Object.entries(og).reduce((acc, [key, value]) => {
    if (simpleMaps[key]) {
      delete og[key];
      return { ...acc, [simpleMaps[key]]: value };
    }

    return acc;
  }, {} as TextProps);

  if (og.textColor) {
    const _key: keyof DefaultTheme['colors'] =
      og.textColor || ('neutral800' as keyof DefaultTheme['colors'] as string);
    mappedProps.color = theme.colors[_key];
    delete og.textColor;
  }

  props?.variant && (mappedProps['data-variant'] = props.variant);
  props?.ellipsis && (mappedProps['className'] = clsx(styles.ellipses, props?.className));

  delete og.variant;
  delete og.ellipsis;

  return { ...og, ...mappedProps };
}

export { mapTypographyPropsToMantine };
