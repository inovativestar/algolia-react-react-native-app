export const Colors = {
  gray1       : '#F1F1F1',
  gray2       : '#B6B6B6',
  gray3       : '#9B9B9B',
  gray4       : '#575757',

  lightgray   : '#B6B6B6',
  blue        : '#4A90E2',
  charcoal    : '#474747',
  gray        : '#7D7D7D',
  white       : '#FFFFFF',
  red         : "#F00F00",
  cosmic      : '#963D32',
  // Gradient
  gradientBlue   : ['#00D3FF', '#8194FE'],
  gradientBlue2  : ['#17EAD9', '#6078EA'],
  gradientPurple : ['#F030C1', '#6094EA'],
  gradientGreen  : ['#57CA85', '#194F68'],
  gradientGreen2 : ['#43E695', '#3BB2B8'],
  gradientYellow : ['#FCE38A', '#F38181'],
  gradientRed    : ['#FF7676', '#F54EA2'],
  gradientBlack  : ['#232526', '#414345'],

}

 const arrayGradient  = [
    Colors.gradientBlue,
    Colors.gradientBlue2,
    Colors.gradientPurple,
    Colors.gradientGreen,
    Colors.gradientYellow,
    Colors.gradientRed
]

export const GradientColors = {

  getRand: () => {

    let clrIndex = Math.floor(Math.random() * 6)
    return arrayGradient[clrIndex];
  },

}
