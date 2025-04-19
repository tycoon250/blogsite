export var input = Array.from(document.getElementsByTagName('input'));
var textarea = Array.from(document.getElementsByTagName('textarea'));
var contact_form = document.getElementById('contact-form');
var login_form = document.getElementById('login-form');
var signup_form = document.getElementById('signup-form');
var data = localStorage.getItem("database");
var sL = Array.from(document.querySelectorAll("a.switch-link"));
var user = localStorage.getItem('user');
import {showForm} from './functions.js'
import {setFocusFor} from './functions.js'
import {setBlurFor} from './functions.js'
import {setSuccessFor} from './functions.js'
import {setErrorFor} from './functions.js'
import {alertMessage} from './functions.js'
import {createAddBlogFrom} from './functions.js'
import {checkFileType} from './functions.js'
import {showPreview} from './functions.js'
import {chkBlgCntnt} from './functions.js'
import {validateForm} from './functions.js'
import {vdtemail} from './functions.js'
if (data == null) {
  var datas = {queries: [],users: [],blogs: [],skills: [],portifolios: [],admins: [],log: []}; 
  localStorage.setItem("database", JSON.stringify(datas));
}

const featuresData = [
  {
    title: 'React.js & Next.js',
    description:
      'Modern front-end frameworks for building scalable, performant, and SEO-optimized web apps.',
    icon: '/images/react.png',
  },
  {
    title: 'Node.js & Express',
    description:
      'Backend tools for crafting secure APIs, handling routing, and creating powerful server-side applications.',
    icon: '/images/node.png',
  },
  {
    title: 'Cloud Platforms (AWS, GCP, Azure)',
    description:
      'Build, deploy, and scale apps using modern cloud infrastructure with seamless DevOps and storage solutions.',
    icon: '/images/aws.png',
  },
  {
    title: 'AI Integrations (Vision, Audio, NLP) For Chat Bots',
    description:
      'Integrate advanced AI features like medical imaging, audio diagnostics, and natural language understanding using external AI APIs.',
    icon: '/images/ai.png',
  },
  {
    title: 'Python, PyTorch & TensorFlow',
    description:
      'Develop and explore generative AI and machine learning applications with strong fundamentals in Python and neural frameworks.',
    icon: '/images/python.png',
  },
  {
    title: 'PHP & C++',
    description:
      'From dynamic scripting to system-level programming, blending flexibility with performance.',
    icon: '/images/php.png',
  },
  {
    title: 'SQL, PostgreSQL & MongoDB',
    description:
      'Mastery in both relational and NoSQL databases, designing clean, efficient, and scalable data models.',
    icon: '/images/mongo.png',
  },
  {
    title: 'RESTful APIs & Integrations',
    description:
      'Create robust, reusable APIs that connect and power frontend-backend communication and external services.',
    icon: '/images/api.png',
  },
  {
    title: 'Git & CI/CD Pipelines',
    description:
      'Version control and automated deployment pipelines to maintain clean, reliable, and testable codebases.',
    icon: '/images/git.png',
  },
];

const projectsData = [
  {
    title: 'Ubuzima Digital Systems (UDS)',
    description:
      'A revolutionary healthcare platform co-developed with Ingoga Technologies LTD, UDS brings AI-driven decision support to clinics across Rwanda. From smart diagnostics to automated medical records and NEXUN Intelligence integration, the system redefines how healthcare providers manage and deliver care. I worked on the full-stack architecture and led the implementation of key features including patient session analytics and AI integrations.',
    icon: '/images/uds.png',
    link: 'https://ubuzima.digital/',
  },
  {
    title: 'Isuku Waste Management System',
    description:
      'A complete SaaS solution built to digitize Rwanda’s traditional waste collection systems. Isuku handles everything from subscription billing to agent coordination and client notifications. The system ensures that unpaid clients don’t receive service, promoting accountability and automated operations. Designed with scalability and user experience at its core.',
    icon: '/images/isuku.png',
    link: 'https://waste-management-system-jet.vercel.app/',
  },
  {
    title: 'ITSpace LTD Ecommerce Website',
    description:
      'Crafted for one of Rwanda’s leading electronics retailers, this ecommerce site gives ITSpace LTD a sleek digital storefront. Featuring secure payment integration, real-time inventory updates, and a modern product display, it transforms how customers interact with tech retail in the region.',
    icon: '/images/itspace.png',
    link: 'https://www.itspace.rw/',
  },
  {
    title: 'Maize Flour Production Management System',
    description:
      'A robust backend system built for New Good Food Industry to manage every stage of maize flour production. From raw maize input to final packaging and distribution, the system also tracks staff wages, expenses, and stock — streamlining operations and driving smarter financial oversight.',
    icon: '/images/ngf.png',
    link: 'https://new-good-food-industry.rw/',
  },
];



function renderFeatures() {
  const featuresContainer = document.getElementById('featuresContainer');

  featuresData.forEach((feature) => {
    const featureCard = document.createElement('div');
    featureCard.className = 'feature-card';

    featureCard.innerHTML = `
                <div class="feature-card-icon">
                   <img src="${feature.icon}" alt="${feature.title} icon" class="icon w-50p h-50p contain" />
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            `;

    featuresContainer.appendChild(featureCard);
  });
}function renderProjects() {
  const projectsContainer = document.getElementById('projectsContainer');

  projectsData.forEach((project) => {
    const projectCard = document.createElement('div');
    projectCard.className = 'w-100 p-20p bsbb p-r bb-1-s-dg b-none-resp flex bblock-resp my-20p';

    projectCard.innerHTML = `
          <div class="project-card-icon">
             <img src="${project.icon}" alt="${project.title} icon" class="icon w-250p h-a contain" />
          </div>
          <div class="px-30p bp-10p-resp">
          <h3 class="my-10p bsbb px-10p bsbb">${project.title}</h3>
          <p class="px-10p bsbb">${project.description}</p>
          <p>
          <a href="${project.link}" target="_blank" class="td-none w-a iblock left mt-30p">
           <button class="p-10p br-10p theme fw-semibold bc-white td-none b-none bfull-resp block p-r">
             View <span class="chevron-right">➔</span>
           </button>
          </a>
          </p>
          </div>
        `;

    projectsContainer.appendChild(projectCard);
  });
}

function setupViewToggle() {
  const featuresGrid = document.querySelector('.feature-contents');
  const navButtons = document.querySelectorAll('.nav-btn');

  navButtons.forEach((button) => {
    button.addEventListener('click', function () {
      navButtons.forEach((btn) => btn.classList.remove('active'));

      this.classList.add('active');

      const viewType = this.getAttribute('data-target');

      if (viewType === 'carousel') {
        featuresGrid.classList.add('carousel-view');
      } else {
        featuresGrid.classList.remove('carousel-view');
      }
    });
  });
}

const benefitsData = [
  {
    id: 'hospitals',
    title: 'Technical Precision',
    statistic: 'Code that solves problems, not just looks good',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"></path>
                <path d="M9 14h6"></path>
                <path d="M9 10h6"></path>
                <path d="M12 18V6"></path>
              </svg>`,
    benefits: [
      'Full-stack expertise: I build both the engine and the dashboard',
      'Clean, scalable codebases that are easy to maintain and extend',
      'Real-time system design with optimized performance in mind',
      'Integrated third-party APIs, analytics, and cloud storage like AWS',
    ],
  },
  {
    id: 'patients',
    title: 'Client-Centered Workflow',
    statistic: '89% of past partners report better project outcomes',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>`,
    benefits: [
      'I work with you not just for you, to bring your vision to life',
      'Fast communication, thoughtful feedback loops, and clear milestones',
      'User-friendly designs focused on intuitive UX and accessibility',
      'Revisions? Feedback? I welcome them. That’s how great products are built.',
    ],
  },
  {
    id: 'health-systems',
    title: 'Results You Can Measure',
    statistic: 'Trackable impact. Long-term value.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12h20"></path>
                <path d="M12 2v20"></path>
                <path d="m4.93 4.93 14.14 14.14"></path>
                <path d="m19.07 4.93-14.14 14.14"></path>
              </svg>`,
    benefits: [
      'Reduced tech debt by implementing modern standards & refactors',
      'Delivered SaaS tools that saved clients time, money, and effort',
      'Built dashboards, systems, and products that scale with businesses',
      'My goal? Make you look good — and keep your users coming back',
    ],
  },
];

function renderBenefits() {
  const benefitsContainer = document.getElementById('benefits-container');

  benefitsData.forEach((benefit, index) => {
    const column = document.createElement('div');
    column.className = 'benefit-column';
    column.id = benefit.id;

    const benefitItems = benefit.benefits
      .map(
        (item) => `
      <li class="benefit-item">
        <span class="check-icon">✓</span>
        <span class="benefit-text">${item}</span>
      </li>
    `
      )
      .join('');

    column.innerHTML = `
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${benefit.icon}
        </svg>
      </div>
      <h3 class="column-title">${benefit.title}</h3>
      <div class="stat-highlight">${benefit.statistic}</div>
      <ul class="benefit-list">
        ${benefitItems}
      </ul>
    `;

    benefitsContainer.appendChild(column);
  });
}

const partners = [
  {
    image: '/images/itspace.png',
    name: 'itspace LTD',
  },
  {
    image: '/images/ingoga-tech.jpeg',
    name: 'ingoga technologies',
  }
];

const partnersContainer = document.getElementById('partners-container');

partners.forEach((partner) => {
  const partnerDiv = document.createElement('div');
  partnerDiv.className = 'partner-logo';

  const img = document.createElement('img');
  img.src = partner.image;
  img.alt = partner.name + ' Logo';
  img.className = 'partner-image contain w-250p h-150p';
  const name = document.createElement('p');
  name.className = 'partner-name capitalize';
  name.textContent = partner.name;

  partnerDiv.appendChild(img);
  partnerDiv.appendChild(name);

  partnersContainer.appendChild(partnerDiv);
});

const navbar = document.querySelector('.navBar');
const heroSection = document.querySelector('.hero-section');

function handleScroll() {
  let heroMiddle = heroSection.offsetTop + heroSection.offsetHeight / 2;
  if (window.scrollY >= 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderFeatures();
  setupViewToggle();
  renderBenefits();
  renderProjects()
  window.addEventListener('scroll', handleScroll);
});
