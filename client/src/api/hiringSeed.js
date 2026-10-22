// Initial content only. Runtime reads come exclusively from the Hiring repository.
import { emptyHiringVacancy, hiringEditable, hiringFingerprint, validateHiringVacancy } from "../../../shared/hiring.mjs";
const starters = [
  {
    "_id": "preview-support",
    "slug": "support-specialist",
    "employment_type": "full_time",
    "work_mode": "hybrid",
    "resume_required": true,
    "portfolio_field_enabled": false,
    "faq_enabled": true,
    "image_mode": "shared",
    "images": {
      "card": "/img/engagement/team-collaboration.webp",
      "detail": null
    },
    "content": {
      "en": {
        "title": "Customer Support Specialist",
        "department": "Customer Experience",
        "city": "Kyiv",
        "schedule": "2-on / 2-off · 09:00–21:00",
        "summary": "A delayed order can test anyone’s patience. Be the calm, clear voice that helps customers understand what happens next—and gets the right people moving.",
        "overview": "Defilicious connects restaurants, customers and our delivery team around one good meal. We’re looking for people who take ownership, communicate clearly and care about the details that make the service work.\n\nA delayed order can test anyone’s patience. Be the calm, clear voice that helps customers understand what happens next—and gets the right people moving.",
        "responsibilities": [
          "Answer order questions through chat and phone, keeping customers informed from the first message to the resolution.",
          "Work with restaurant and delivery colleagues to check the details and find a practical next step.",
          "Keep a clear record of each case so the next person can pick it up without starting over.",
          "Spot recurring questions and share useful feedback that helps the team improve the service."
        ],
        "requirements": [
          "Clear written and spoken Ukrainian, with a considerate tone even when a conversation gets difficult.",
          "The ability to listen, ask useful questions and explain the next step in plain language.",
          "Confidence using a computer and switching between messages, order details and team tools.",
          "Experience in customer service or hospitality is welcome; care, judgement and willingness to learn matter just as much."
        ],
        "conditions": [
          "Full-time, 2-on / 2-off shifts from 09:00 to 21:00, with the rota shared in advance.",
          "Paid onboarding with a buddy to help you learn the service and handle your first cases.",
          "Kyiv office during onboarding, then hybrid work with equipment provided.",
          "Regular coaching and a team you can turn to during your shift."
        ],
        "image_alt": "Colleagues working together at a table",
        "detail_image_alt": "Colleagues working together at a table",
        "faq": [
          {
            "id": "faq-0",
            "question": "Do I need an account to apply?",
            "answer": "No. Open a vacancy and complete its application form directly. The form explains which details are required."
          },
          {
            "id": "faq-1",
            "question": "Do I need to send a CV?",
            "answer": "The individual role page tells you whether a CV is required. Share an accessible link; the application does not accept file uploads."
          },
          {
            "id": "faq-2",
            "question": "Where can I find salary and working arrangements?",
            "answer": "Location and working arrangements are listed on each role page. We discuss the role’s pay and other terms during recruitment."
          },
          {
            "id": "faq-3",
            "question": "What happens after I apply?",
            "answer": "The team reviews your application. If your experience matches the current role, we contact you using the details you provided."
          }
        ]
      },
      "uk": {
        "title": "Фахівець підтримки клієнтів",
        "department": "Клієнтський досвід",
        "city": "Київ",
        "schedule": "2 через 2 · 09:00–21:00",
        "summary": "Затримка замовлення може випробувати будь-чиє терпіння. Будь спокійним і зрозумілим голосом, який допомагає клієнтам зорієнтуватися й залучає потрібних людей.",
        "overview": "Defilicious поєднує ресторани, клієнтів і нашу команду доставки навколо хорошої їжі. Шукаємо людей, які беруть відповідальність, зрозуміло спілкуються й дбають про деталі, завдяки яким працює сервіс.\n\nЗатримка замовлення може випробувати будь-чиє терпіння. Будь спокійним і зрозумілим голосом, який допомагає клієнтам зорієнтуватися й залучає потрібних людей.",
        "responsibilities": [
          "Відповідати на запитання про замовлення в чаті й телефоном, тримаючи клієнта в курсі від першого повідомлення до розв’язання ситуації.",
          "Разом із колегами з ресторанів і доставки перевіряти деталі та знаходити практичний наступний крок.",
          "Зрозуміло фіксувати кожне звернення, щоб інша людина могла підхопити його без повторних запитань.",
          "Помічати повторювані запитання й передавати команді зворотний зв’язок, який допомагає покращувати сервіс."
        ],
        "requirements": [
          "Грамотна усна й письмова українська та доброзичливий тон, навіть коли розмова непроста.",
          "Уміння слухати, ставити корисні запитання й пояснювати наступний крок простими словами.",
          "Впевнена робота з комп’ютером і готовність перемикатися між повідомленнями, деталями замовлень та інструментами команди.",
          "Досвід у підтримці чи гостинності стане перевагою. Уважність, розсудливість і бажання вчитися важать не менше."
        ],
        "conditions": [
          "Повна зайнятість: зміни 2 через 2 з 09:00 до 21:00. Графік отримуєш заздалегідь.",
          "Оплачуване навчання й наставник, який допоможе розібратися в сервісі та перших зверненнях.",
          "На період навчання — офіс у Києві, далі гібридна робота. Надаємо робочу техніку.",
          "Регулярний зворотний зв’язок і команда, до якої можна звернутися протягом зміни."
        ],
        "image_alt": "Колеги працюють разом за столом",
        "detail_image_alt": "Колеги працюють разом за столом",
        "faq": [
          {
            "id": "faq-0",
            "question": "Чи потрібен акаунт для відгуку?",
            "answer": "Ні. Відкрий вакансію та заповни форму на її сторінці. Обов’язкові дані позначені у формі."
          },
          {
            "id": "faq-1",
            "question": "Чи потрібно надсилати резюме?",
            "answer": "На сторінці вакансії зазначено, чи обов’язкове резюме. Додай доступне посилання: форма не підтримує завантаження файлів."
          },
          {
            "id": "faq-2",
            "question": "Де дізнатися про оплату та формат роботи?",
            "answer": "Місце й формат роботи зазначені на сторінці вакансії. Оплату та інші умови цієї ролі обговорюємо під час набору."
          },
          {
            "id": "faq-3",
            "question": "Що відбувається після відгуку?",
            "answer": "Команда розглядає заявку. Якщо твій досвід відповідає актуальній ролі, зв’яжемося за вказаними контактами."
          }
        ]
      }
    }
  },
  {
    "_id": "preview-partners",
    "slug": "restaurant-manager",
    "employment_type": "full_time",
    "work_mode": "hybrid",
    "resume_required": false,
    "portfolio_field_enabled": true,
    "faq_enabled": true,
    "image_mode": "separate",
    "images": {
      "card": "/img/engagement/restaurant-handoff.webp",
      "detail": "/img/engagement/team-collaboration.webp"
    },
    "content": {
      "en": {
        "title": "Restaurant Partner Manager",
        "department": "Restaurant Partnerships",
        "city": "Kyiv",
        "schedule": "Mon–Fri · 09:00–18:00",
        "summary": "Great restaurant partnerships start with a useful conversation—and grow through good follow-through. Help Kyiv’s kitchens get ready for delivery and keep everyday operations running smoothly.",
        "overview": "Defilicious connects restaurants, customers and our delivery team around one good meal. We’re looking for people who take ownership, communicate clearly and care about the details that make the service work.\n\nGreat restaurant partnerships start with a useful conversation—and grow through good follow-through. Help Kyiv’s kitchens get ready for delivery and keep everyday operations running smoothly.",
        "responsibilities": [
          "Guide restaurant partners from the first conversation through menu setup and the first order handover.",
          "Keep menu information, contacts and agreed next steps accurate and easy for the team to find.",
          "Meet partners in Kyiv, understand how their kitchens work and help resolve day-to-day questions.",
          "Coordinate with delivery and support colleagues, then follow up until the issue has a clear owner and outcome."
        ],
        "requirements": [
          "Clear Ukrainian and confidence talking with restaurant owners, managers and kitchen teams.",
          "Experience in hospitality, account management or business support, with examples of reliable follow-through.",
          "An organised approach to contacts, spreadsheets, CRM records and several conversations running at once.",
          "Curiosity about how restaurants work and a willingness to visit partners around Kyiv."
        ],
        "conditions": [
          "Full-time, Monday to Friday from 09:00 to 18:00, with a lunch break.",
          "Hybrid work in Kyiv, combining office days, remote work and visits to restaurant partners.",
          "Structured onboarding with the operations team and a clear handover of your partner portfolio.",
          "Work equipment, regular feedback and room to improve the way we support restaurants."
        ],
        "image_alt": "Restaurant colleagues handing over an order",
        "detail_image_alt": "Colleagues working together at a table",
        "faq": [
          {
            "id": "faq-0",
            "question": "Do I need an account to apply?",
            "answer": "No. Open a vacancy and complete its application form directly. The form explains which details are required."
          },
          {
            "id": "faq-1",
            "question": "Do I need to send a CV?",
            "answer": "The individual role page tells you whether a CV is required. Share an accessible link; the application does not accept file uploads."
          },
          {
            "id": "faq-2",
            "question": "Where can I find salary and working arrangements?",
            "answer": "Location and working arrangements are listed on each role page. We discuss the role’s pay and other terms during recruitment."
          },
          {
            "id": "faq-3",
            "question": "What happens after I apply?",
            "answer": "The team reviews your application. If your experience matches the current role, we contact you using the details you provided."
          }
        ]
      },
      "uk": {
        "title": "Менеджер із роботи з ресторанами",
        "department": "Партнерства з ресторанами",
        "city": "Київ",
        "schedule": "Пн–пт · 09:00–18:00",
        "summary": "Хороше партнерство починається з корисної розмови й зростає завдяки виконаним домовленостям. Допомагай київським ресторанам готуватися до доставки та злагоджувати щоденну роботу.",
        "overview": "Defilicious поєднує ресторани, клієнтів і нашу команду доставки навколо хорошої їжі. Шукаємо людей, які беруть відповідальність, зрозуміло спілкуються й дбають про деталі, завдяки яким працює сервіс.\n\nХороше партнерство починається з корисної розмови й зростає завдяки виконаним домовленостям. Допомагай київським ресторанам готуватися до доставки та злагоджувати щоденну роботу.",
        "responsibilities": [
          "Супроводжувати ресторан від першої розмови до налаштування меню й передачі першого замовлення.",
          "Підтримувати актуальність меню, контактів і домовленостей, щоб команда легко знаходила потрібну інформацію.",
          "Зустрічатися з партнерами в Києві, розуміти роботу їхніх кухонь і допомагати зі щоденними запитаннями.",
          "Координувати питання з доставкою та підтримкою й доводити їх до зрозумілого відповідального та результату."
        ],
        "requirements": [
          "Грамотна українська й упевнене спілкування з власниками, менеджерами та командами ресторанів.",
          "Досвід у гостинності, роботі з клієнтами чи підтримці бізнесу та приклади виконаних домовленостей.",
          "Організованість у роботі з контактами, таблицями, CRM і кількома розмовами одночасно.",
          "Інтерес до роботи ресторанів і готовність відвідувати партнерів у Києві."
        ],
        "conditions": [
          "Повна зайнятість: понеділок–п’ятниця з 09:00 до 18:00 з обідньою перервою.",
          "Гібридна робота в Києві: офіс, дистанційні дні й зустрічі з ресторанами-партнерами.",
          "Послідовне введення в роботу з операційною командою та зрозуміла передача портфеля партнерів.",
          "Робоча техніка, регулярний зворотний зв’язок і можливість покращувати наш підхід до підтримки ресторанів."
        ],
        "image_alt": "Команда ресторану передає замовлення",
        "detail_image_alt": "Колеги працюють разом за столом",
        "faq": [
          {
            "id": "faq-0",
            "question": "Чи потрібен акаунт для відгуку?",
            "answer": "Ні. Відкрий вакансію та заповни форму на її сторінці. Обов’язкові дані позначені у формі."
          },
          {
            "id": "faq-1",
            "question": "Чи потрібно надсилати резюме?",
            "answer": "На сторінці вакансії зазначено, чи обов’язкове резюме. Додай доступне посилання: форма не підтримує завантаження файлів."
          },
          {
            "id": "faq-2",
            "question": "Де дізнатися про оплату та формат роботи?",
            "answer": "Місце й формат роботи зазначені на сторінці вакансії. Оплату та інші умови цієї ролі обговорюємо під час набору."
          },
          {
            "id": "faq-3",
            "question": "Що відбувається після відгуку?",
            "answer": "Команда розглядає заявку. Якщо твій досвід відповідає актуальній ролі, зв’яжемося за вказаними контактами."
          }
        ]
      }
    }
  },
  {
    "_id": "vacancy-delivery-operations",
    "slug": "delivery-operations-coordinator",
    "employment_type": "full_time",
    "work_mode": "onsite",
    "resume_required": true,
    "portfolio_field_enabled": false,
    "faq_enabled": false,
    "image_mode": "shared",
    "images": {
      "card": "/img/engagement/courier-in-city.webp",
      "detail": null
    },
    "content": {
      "en": {
        "title": "Delivery Operations Coordinator",
        "department": "Delivery Operations",
        "city": "Kyiv",
        "schedule": "Mon–Fri · 09:00–18:00",
        "summary": "Keep restaurant handovers and courier routes moving, with clear updates for everyone involved.",
        "overview": "Help our restaurant, courier and support teams work together throughout the day. Track order handovers, notice delays early and make sure each issue reaches the right person.\n\nYou will work with the city operations team in Kyiv and help turn everyday feedback into practical improvements.",
        "responsibilities": [
          "Monitor order handovers and help resolve delivery delays.",
          "Coordinate clear updates between restaurants, couriers and support.",
          "Keep an accurate record of issues and agreed next steps.",
          "Share recurring problems with the city operations team."
        ],
        "requirements": [
          "Clear Ukrainian communication and a calm approach to busy periods.",
          "Confidence using spreadsheets and order management tools.",
          "An organised approach to several tasks at once.",
          "Experience in delivery, hospitality or customer service is welcome."
        ],
        "conditions": [
          "Full-time work in Kyiv, Monday to Friday from 09:00 to 18:00.",
          "Structured onboarding with the city operations team.",
          "Regular feedback and support from experienced colleagues."
        ],
        "image_alt": "A courier travelling through the city",
        "detail_image_alt": "",
        "faq": []
      },
      "uk": {
        "title": "Координатор операцій доставки",
        "department": "Операції доставки",
        "city": "Київ",
        "schedule": "Пн–пт · 09:00–18:00",
        "summary": "Допомагай ресторанам і кур’єрам вчасно передавати замовлення та тримай усіх у курсі змін.",
        "overview": "Допомагай командам ресторанів, кур’єрів і підтримки злагоджено працювати щодня. Стеж за передачею замовлень, завчасно помічай затримки та передавай питання потрібним людям.\n\nТи працюватимеш із міською операційною командою в Києві й допомагатимеш перетворювати щоденний зворотний зв’язок на практичні покращення.",
        "responsibilities": [
          "Стежити за передачею замовлень і допомагати усувати затримки доставки.",
          "Координувати зрозумілі оновлення між ресторанами, кур’єрами й підтримкою.",
          "Вести точні записи про проблеми та узгоджені наступні кроки.",
          "Повідомляти міську операційну команду про повторювані проблеми."
        ],
        "requirements": [
          "Грамотне спілкування українською та спокійний підхід під час навантаження.",
          "Упевнена робота з таблицями й інструментами керування замовленнями.",
          "Організованість у роботі з кількома завданнями одночасно.",
          "Досвід у доставці, гостинності чи підтримці клієнтів буде перевагою."
        ],
        "conditions": [
          "Повна зайнятість у Києві: понеділок–п’ятниця з 09:00 до 18:00.",
          "Послідовне навчання з міською операційною командою.",
          "Регулярний зворотний зв’язок і підтримка досвідчених колег."
        ],
        "image_alt": "Кур’єр їде містом",
        "detail_image_alt": "",
        "faq": []
      }
    }
  }
];
export function createHiringStarters() {
 const now = new Date().toISOString();
 return starters.map(input => {
  const normalized = validateHiringVacancy({ ...emptyHiringVacancy(), ...structuredClone(input) }).data;
  const record = { ...normalized, _id: input._id, seed_format: 1, createdAt: now, updatedAt: now, published_at: now, published_revision: 0, publication_status: "published" };
  const fingerprint = hiringFingerprint(record);
  record.reviews = { en: fingerprint, uk: fingerprint };
  record.published_snapshot = structuredClone(hiringEditable(record));
  return record;
 });
}
