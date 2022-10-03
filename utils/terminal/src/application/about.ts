import { ApplicationInterface } from '../interface'
import { Window } from '../utils'
import AboutData from './data/about.json'

interface AboutInterface {
  userInfo: {
    firstname: string
    lastname: string
    poste: string
    experience: string
    ville: string
    telephone: string
    email: string
  }
  experiences: ExperienceInterface[]
  degrees: DegreeInterface[]
  hobbies: string[]
}

interface ExperienceInterface {
  date: string
  entreprise: string
  description: string
  technology: string
}

interface DegreeInterface {
  date: string
  name: string
  school: string
  description: string
}

export class About extends Window implements ApplicationInterface {
  COMMAND_NAME: string = 'about'
  description: string = 'Voulez-vous en savoir plus sur moi ?'
  data: AboutInterface = AboutData

  constructor() {
    super()

    this.simulator.classList.add('hidden')
    // document.removeEventListener('keydown', document);
  }

  execute(): HTMLDivElement | null {
    this.openAbout()

    return null
  }

  openAbout() {
    this.setHeight('600px')
    this.simulator.classList.remove('hidden')
    this.drawContent()
    this.displayFront()
  }

  drawContent() {
    this.content.innerHTML = ''

    const divElement = this.HTMLElementService.createElement('div')

    divElement.innerHTML += this.getUserInformationsTable();
    divElement.innerHTML += this.getExperiencesTable()
    divElement.innerHTML += this.getDegreeTable()
    divElement.innerHTML += this.getHobbiesTable()

    this.content.append(divElement)
  }

  private getUserInformationsTable(): string {
    return '<table class="table w-50">\n' +
      '  <thead>\n' +
      '    <tr>\n' +
      `      <th colspan="2">User Informations</th>\n` +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody>\n' +
      '    <tr>\n' +
      `      <td>name</td>\n` +
      `      <td>${this.data.userInfo.firstname} ${this.data.userInfo.lastname}</td>\n` +
      '    </tr>\n' +
      '    <tr>\n' +
      `      <td>poste</td>\n` +
      `      <td>${this.data.userInfo.poste}</td>\n` +
      '    </tr>\n' +
      '    <tr>\n' +
      `      <td>experience</td>\n` +
      `      <td>${this.data.userInfo.experience}</td>\n` +
      '    </tr>\n' +
      '    <tr>\n' +
      `      <td>city</td>\n` +
      `      <td>${this.data.userInfo.ville}</td>\n` +
      '    </tr>\n' +
      '    <tr>\n' +
      `      <td>email</td>\n` +
      `      <td>${this.data.userInfo.email}</td>\n` +
      '    </tr>\n' +
      '  </tbody>\n' +
      '</table>\n';
  }

  private getExperiencesTable(): string {
    let experiences =
      '<table class="table w-100">\n' +
      '  <thead>\n' +
      '    <tr>\n' +
      '      <th colspan="4">Experiences</th>\n' +
      '    </tr>\n' +
      '    <tr>\n' +
      '      <th>Date</th>\n' +
      '      <th>Entreprise</th>\n' +
      '      <th>Description</th>\n' +
      '      <th>Technology</th>\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody>\n'

    this.data.experiences.forEach((experience) => {
      experiences +=
        '    <tr>\n' +
        `      <td>${experience.date}</td>\n` +
        `      <td>${experience.entreprise}</td>\n` +
        `      <td>${experience.description}</td>\n` +
        `      <td>${experience.technology}</td>\n` +
        '    </tr>\n'
    })

    experiences += '  </tbody>\n' + '</table>\n'
    return experiences
  }

  private getHobbiesTable(): string {
    if (0 === this.data.hobbies.length) return ''

    let hobbies =
      '<table class="table w-100">\n' +
      '  <thead>\n' +
      '    <tr>\n' +
      '      <th>Hobbies</th>\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody>\n'

    this.data.hobbies.forEach((hobby) => {
      hobbies += '    <tr>\n' + `      <td>${hobby}</td>\n` + '    </tr>\n'
    })

    hobbies += '  </tbody>\n' + '</table>\n'
    return hobbies
  }

  private getDegreeTable(): string {
    let degrees =
      '<table class="table w-100">\n' +
      '  <thead>\n' +
      '    <tr>\n' +
      '      <th colspan="4">Degrees</th>\n' +
      '    </tr>\n' +
      '    <tr>\n' +
      '      <th>Date</th>\n' +
      '      <th>Name</th>\n' +
      '      <th>School</th>\n' +
      '      <th>Description</th>\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody>\n'

    this.data.degrees.forEach((degree) => {
      degrees +=
        '    <tr>\n' +
        `      <td>${degree.date}</td>\n` +
        `      <td>${degree.name}</td>\n` +
        `      <td>${degree.school}</td>\n` +
        `      <td>${degree.description}</td>\n` +
        '    </tr>\n'
    })

    degrees += '  </tbody>\n' + '</table>\n'
    return degrees
  }
}
