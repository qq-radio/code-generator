/** @type {import('stylelint').Config} */
module.exports = {
  files: ['*.vue', '**/*.vue', '*.html', '**/*.html'],
  customSyntax: 'postcss-html',
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extends', 'apply']
      }
    ],
    'block-no-empty': true,
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-order': ['width', 'height']
  },
  overrides: [
    {
      files: ['*.less', '**/*.less'],
      customSyntax: 'postcss-less',
      extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue']
    }
  ]
}
