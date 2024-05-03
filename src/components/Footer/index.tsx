import { GithubLogo, LinkedinLogo } from 'phosphor-react'

import { Container, Links, Me } from './styles'

export default function Footer() {
  return (
    <Container>
      <Me>
        Developed by <span>Jeff Gouveia</span> @ 2024
      </Me>

      <Links>
        <a
          href="https://www.linkedin.com/in/jefferson-gouveia/"
          target="_blank"
          rel="noreferrer"
        >
          <LinkedinLogo size={20} weight="fill" />
          LinkedIn
        </a>

        <a
          href="https://github.com/jeffersongouveia"
          target="_blank"
          rel="noreferrer"
        >
          <GithubLogo size={20} />
          GitHub
        </a>
      </Links>
    </Container>
  )
}
