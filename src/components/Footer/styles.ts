import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 80,
})

export const Me = styled('p', {
  display: 'flex',
  gap: '$1',
  color: '$white',

  span: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
})

export const Links = styled('p', {
  display: 'flex',
  gap: '$3',
  marginTop: '$2',

  a: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '$1',
    color: '$gray200',
    textDecoration: 'none',
    transition: 'color 0.2s',

    '&:hover': {
      color: '$gray400',
    },
  },
})
