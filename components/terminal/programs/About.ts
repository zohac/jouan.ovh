import { IProgram } from "~/components/terminal/interfaces";

interface ExperienceInterface {
  date: string;
  entreprise: string;
  description: string;
  technology: string;
}

interface DegreeInterface {
  date: string;
  name: string;
  school: string;
  description: string;
}

interface AboutInterface {
  userInfo: {
    firstname: string;
    lastname: string;
    poste: string;
    experience: string;
    ville: string;
    telephone: string;
    email: string;
  };
  experiences: ExperienceInterface[];
  degrees: DegreeInterface[];
  hobbies: string[];
}

interface AboutInterface {
  userInfo: {
    firstname: string;
    lastname: string;
    poste: string;
    experience: string;
    ville: string;
    telephone: string;
    email: string;
  };
  experiences: ExperienceInterface[];
  degrees: DegreeInterface[];
  hobbies: string[];
}

interface ExperienceInterface {
  date: string;
  entreprise: string;
  description: string;
  technology: string;
}

interface DegreeInterface {
  date: string;
  name: string;
  school: string;
  description: string;
}

const aboutData = {
  userInfo: {
    firstname: "Simon",
    lastname: "JOUAN",
    poste: "Développeur Fullstack & Testeur QA",
    experience: "3 ans",
    ville: "Valognes, France",
    telephone: "+33 6 58 96 90 20",
    email: "simon@jouan.ovh",
  },
  experiences: [
    {
      date: "02/2021 - aujourd'hui",
      entreprise: "Linkizz",
      description: "Testeur QA",
      technology: "nodejs Typesript Testcafé",
    },
    {
      date: "05/2020 - 12/2021",
      entreprise: "CINS",
      description: "Développeur Full Stack",
      technology:
        "PHP/MySQL HTML/CSS JS SASS Symfony-4/5 Drupal-7/8 Prestashop-1.7.* Wordpress Bootstrap Git Docker",
    },
    {
      date: "07/2007 - 05/2019",
      entreprise: "A+ Métrologie/Trescal",
      description: "Métrologue",
      technology:
        "Technicien métrologue multi-grandeur. Suppléant du dossier COFRAC en Électricité - magnétisme. Suppléant du laboratoire Électricité - magnétisme",
    },
    {
      date: "07/2001 - 07/2006",
      entreprise: "OPTEOR",
      description: "Régleur / Instrumentiste",
      technology: "Maintenance industrielle sur un site pétrochimique",
    },
  ],
  degrees: [
    {
      date: "2017 - 2018",
      name: "Développeur d’application - PHP / Symfony",
      school: "OpenClassrooms",
      description:
        "Projet Wordpress • Projet Bootstrap • Projet Mysql • Projet PHP – POO • 3 Projet Symfony",
    },
    {
      date: "1999 - 2001",
      name: "BTS CIRA",
      school: "Lycée A. de Tocqueville à Cherbourg",
      description: "Contrôle Industriel et Régulation Automatique",
    },
    {
      date: "1997 - 1999",
      name: "BAC STL PLPI",
      school: "Lycée A. de Tocqueville à Cherbourg",
      description:
        "Science et Technique de Laboratoire option Physique de Laboratoire et Procédé Industriel",
    },
  ],
  hobbies: ["crossfit"],
};

class About {
  data: AboutInterface = aboutData;

  parseData() {
    return (
      this.getUserInformationsTable() +
      this.getExperiencesTable() +
      this.getDegreeTable() +
      this.getHobbiesTable()
    );
  }

  private getUserInformationsTable(): string {
    return (
      '<table class="table w-50">\n' +
      "  <thead>\n" +
      "    <tr>\n" +
      `      <th colspan="2">User Informations</th>\n` +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n" +
      "    <tr>\n" +
      `      <td>name</td>\n` +
      `      <td>${this.data.userInfo.firstname} ${this.data.userInfo.lastname}</td>\n` +
      "    </tr>\n" +
      "    <tr>\n" +
      `      <td>poste</td>\n` +
      `      <td>${this.data.userInfo.poste}</td>\n` +
      "    </tr>\n" +
      "    <tr>\n" +
      `      <td>experience</td>\n` +
      `      <td>${this.data.userInfo.experience}</td>\n` +
      "    </tr>\n" +
      "    <tr>\n" +
      `      <td>city</td>\n` +
      `      <td>${this.data.userInfo.ville}</td>\n` +
      "    </tr>\n" +
      "    <tr>\n" +
      `      <td>email</td>\n` +
      `      <td>${this.data.userInfo.email}</td>\n` +
      "    </tr>\n" +
      "  </tbody>\n" +
      "</table>\n"
    );
  }

  private getExperiencesTable(): string {
    let experiences =
      '<table class="table w-100">\n' +
      "  <thead>\n" +
      "    <tr>\n" +
      '      <th colspan="4">Experiences</th>\n' +
      "    </tr>\n" +
      "    <tr>\n" +
      "      <th>Date</th>\n" +
      "      <th>Entreprise</th>\n" +
      "      <th>Description</th>\n" +
      "      <th>Technology</th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n";

    this.data.experiences.forEach((experience) => {
      experiences +=
        "    <tr>\n" +
        `      <td>${experience.date}</td>\n` +
        `      <td>${experience.entreprise}</td>\n` +
        `      <td>${experience.description}</td>\n` +
        `      <td>${experience.technology}</td>\n` +
        "    </tr>\n";
    });

    experiences += "  </tbody>\n" + "</table>\n";
    return experiences;
  }

  private getHobbiesTable(): string {
    if (this.data.hobbies.length === 0) return "";

    let hobbies =
      '<table class="table w-100">\n' +
      "  <thead>\n" +
      "    <tr>\n" +
      "      <th>Hobbies</th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n";

    this.data.hobbies.forEach((hobby) => {
      hobbies += "    <tr>\n" + `      <td>${hobby}</td>\n` + "    </tr>\n";
    });

    hobbies += "  </tbody>\n" + "</table>\n";
    return hobbies;
  }

  private getDegreeTable(): string {
    let degrees =
      '<table class="table w-100">\n' +
      "  <thead>\n" +
      "    <tr>\n" +
      '      <th colspan="4">Degrees</th>\n' +
      "    </tr>\n" +
      "    <tr>\n" +
      "      <th>Date</th>\n" +
      "      <th>Name</th>\n" +
      "      <th>School</th>\n" +
      "      <th>Description</th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n";

    this.data.degrees.forEach((degree) => {
      degrees +=
        "    <tr>\n" +
        `      <td>${degree.date}</td>\n` +
        `      <td>${degree.name}</td>\n` +
        `      <td>${degree.school}</td>\n` +
        `      <td>${degree.description}</td>\n` +
        "    </tr>\n";
    });

    degrees += "  </tbody>\n" + "</table>\n";
    return degrees;
  }
}

const about: IProgram = {
  command: "about",
  description: "Voulez-vous en savoir plus sur moi ?",
  initialData: new About().parseData(),
  run: (_, createNewTerminal, initialData?: string) => {
    if (createNewTerminal && initialData) {
      createNewTerminal({
        height: "600px",
        width: "800px",
        initialData,
      });
      return "Un nouveau terminal a été ouvert.";
    }

    if (createNewTerminal) {
      createNewTerminal();
      return "Un nouveau terminal a été ouvert.";
    }

    return "Impossible d'ouvrir un nouveau terminal.";
  },
};

export default about;
