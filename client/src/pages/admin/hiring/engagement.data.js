// Shared candidate and restaurant fixtures. Vacancy references below preserve candidate history, not public jobs.
const timestamp = (day, time = "09:00") => `2026-10-${day}T${time}:00.000Z`;
const dayAt = (offset, hour = 9, minute = 0) =>
  new Date(Date.UTC(2026, 8, 5 + offset, hour, minute)).toISOString();
const vacancy = (id, title, department, city, status = "published") => ({
  _id: id,
  slug: id.replace("preview-", ""),
  title,
  department,
  city,
  portfolio_field_enabled: false,
  publication_status: status,

});

const additionalRoles = [
  [
    "partner-success-specialist",
    "Partner Success Specialist",
    "Partnerships",
    "Kharkiv",
  ],
  ["dispatch-supervisor", "Dispatch Supervisor", "Operations", "Kyiv"],
  [
    "customer-experience-lead",
    "Customer Experience Lead",
    "Customer Experience",
    "Lviv",
  ],
  [
    "menu-quality-specialist",
    "Menu Quality Specialist",
    "Operations",
    "Vinnytsia",
  ],
  ["recruitment-coordinator", "Recruitment Coordinator", "People", "Kyiv"],
  [
    "growth-marketing-specialist",
    "Growth Marketing Specialist",
    "Marketing",
    "Remote",
  ],
  ["finance-analyst", "Finance Analyst", "Finance", "Kyiv"],
  [
    "courier-operations-specialist",
    "Courier Operations Specialist",
    "Operations",
    "Lviv",
  ],
  [
    "account-manager-odesa",
    "Restaurant Account Manager",
    "Partnerships",
    "Odesa",
  ],
  [
    "quality-assurance-analyst",
    "Quality Assurance Analyst",
    "Customer Experience",
    "Remote",
  ],
  ["brand-designer", "Brand Designer", "Marketing", "Kyiv"],
  ["workforce-planner", "Workforce Planner", "Operations", "Dnipro"],
  ["training-specialist", "Training Specialist", "People", "Lviv"],
  ["data-analyst", "Data Analyst", "Product & Technology", "Remote"],
  ["product-designer", "Product Designer", "Product & Technology", "Kyiv"],
  [
    "technical-support-engineer",
    "Technical Support Engineer",
    "Product & Technology",
    "Remote",
  ],
  [
    "city-coordinator-chernivtsi",
    "City Coordinator",
    "Operations",
    "Chernivtsi",
  ],
  ["people-partner", "People Partner", "People", "Kyiv", "draft"],
  [
    "social-media-manager",
    "Social Media Manager",
    "Marketing",
    "Lviv",
    "draft",
  ],
  ["payments-specialist", "Payments Specialist", "Finance", "Remote", "draft"],
  ["operations-analyst", "Operations Analyst", "Operations", "Kyiv", "draft"],
  [
    "frontend-developer",
    "Frontend Developer",
    "Product & Technology",
    "Remote",
    "draft",
  ],
  ["community-manager", "Community Manager", "Marketing", "Odesa", "closed"],
  ["office-coordinator", "Office Coordinator", "People", "Kyiv", "closed"],
  [
    "regional-partnerships-lead",
    "Regional Partnerships Lead",
    "Partnerships",
    "Lviv",
    "closed",
  ],
];

const candidateVacancyReferences = [
  {
    ...vacancy(
      "preview-support",
      "Customer Support Specialist",
      "Customer Experience",
      "Kyiv",
    ),
    slug: "support-specialist",
  },
  {
    ...vacancy(
      "preview-partners",
      "Restaurant Partnerships Manager",
      "Partnerships",
      "Lviv",
    ),
    slug: "restaurant-manager",
    resume_required: false,
    portfolio_field_enabled: true,
  },
  vacancy(
    "preview-operations-coordinator",
    "Delivery Operations Coordinator",
    "Operations",
    "Odesa",
  ),
  vacancy(
    "preview-content-editor",
    "Content Editor",
    "Marketing",
    "Kyiv",
    "draft",
  ),
  vacancy(
    "preview-city-lead",
    "City Operations Lead",
    "Operations",
    "Dnipro",
    "closed",
  ),
  ...additionalRoles.map(([id, title, department, city, status]) => ({
    ...vacancy(`preview-${id}`, title, department, city, status),
    portfolio_field_enabled: [
      "Brand Designer",
      "Product Designer",
      "Social Media Manager",
    ].includes(title),
  })),
];

const reviewers = [
  "Alex Morgan",
  "Nadia Koval",
  "James Parker",
  "Marta Williams",
];
const firstNames = [
  "Ava",
  "James",
  "Isabella",
  "Ethan",
  "Charlotte",
  "Lucas",
  "Amelia",
  "Henry",
  "Harper",
  "Alexander",
  "Evelyn",
  "Benjamin",
  "Sofia",
  "Jack",
  "Abigail",
  "Leo",
  "Emily",
  "Oscar",
  "Elizabeth",
  "George",
  "Chloe",
  "Theodore",
  "Grace",
  "Felix",
  "Victoria",
  "Arthur",
  "Lily",
  "Samuel",
  "Natalia",
  "Gabriel",
  "Alice",
  "David",
  "Clara",
  "Adam",
  "Zoe",
  "Matthew",
  "Hannah",
  "Nathan",
  "Julia",
  "Oliver",
  "Maya",
  "Roman",
  "Iryna",
  "Andrii",
  "Daria",
  "Maksym",
  "Kateryna",
  "Taras",
];
const lastNames = [
  "Walker",
  "Shevchenko",
  "Hughes",
  "Koval",
  "Reed",
  "Melnyk",
  "Campbell",
  "Tkachenko",
  "Parker",
  "Kravchenko",
  "Foster",
  "Savchenko",
  "Brooks",
  "Moroz",
  "Evans",
  "Lysenko",
  "Cooper",
  "Polishchuk",
  "Richardson",
  "Tkachuk",
  "Harris",
  "Kozak",
  "Mitchell",
  "Rudenko",
  "Sullivan",
  "Pavlenko",
  "Phillips",
  "Marchenko",
  "Wood",
  "Klymenko",
  "Edwards",
  "Boyko",
  "Harrison",
  "Zakharchenko",
  "Collins",
  "Symonenko",
  "Baker",
  "Ivanenko",
  "Scott",
  "Popov",
  "Murphy",
  "Honchar",
  "Adams",
  "Oliinyk",
  "Stewart",
  "Danylenko",
  "Ross",
  "Kovalchuk",
];
const cities = [
  "Kyiv",
  "Lviv",
  "Odesa",
  "Dnipro",
  "Vinnytsia",
  "Ivano-Frankivsk",
  "Kharkiv",
  "Chernivtsi",
  "Ternopil",
  "Lutsk",
  "Rivne",
  "Poltava",
  "Cherkasy",
  "Uzhhorod",
  "Zhytomyr",
  "Khmelnytskyi",
];
const candidateComments = [
  "I have four years of experience in a busy customer service team and would like to bring that experience to Defilicious.",
  "Available to start after a two-week notice period. Happy to discuss the role and share more about my recent projects.",
  "I recently completed a project improving response times and customer satisfaction. My resume includes the results and responsibilities.",
  "Interested in this opportunity. Please contact me by email to arrange an introductory conversation.",
  "I have worked with restaurant teams across several locations, from onboarding and menu preparation to reviewing service performance. I enjoy turning complex operational problems into clear, practical steps.",
  "The role looks like a good next step for me. I am comfortable working across departments and managing a changing daily workload.",
  "My background combines hospitality and digital services. I can share references following an initial call.",
  "I am looking for a team where I can develop my skills and take responsibility for measurable service improvements.",
];
const courierComments = [
  "I have my own bicycle and can cover weekday evening shifts.",
  "Two years of delivery experience. Available during lunch hours and on weekends.",
  "Interested in flexible shifts. I know the central neighborhoods well and have a reliable smartphone.",
  "I deliver by scooter and can start next month. Please call after 3 pm.",
];
const statusWords = {
  new: "New",
  in_review: "In review",
  contacted: "Contacted",
  completed: "Completed",
  rejected: "Rejected",
};

function recordActivity(
  id,
  status,
  received,
  updated,
  note,
  restaurant = false,
) {
  const initial = {
    id: `${id}-received`,
    type: "status",
    body: restaurant ? "Restaurant inquiry received." : "Application received.",
    status: "new",
    author: "System",
    at: received,
  };
  if (status === "new") return [initial];
  const reviewer = reviewers[id.length % reviewers.length];
  const midpoint = new Date(
    (Date.parse(received) + Date.parse(updated)) / 2,
  ).toISOString();
  return [
    initial,
    {
      id: `${id}-review`,
      type: "status",
      body: "Status changed to In review.",
      status: "in_review",
      author: reviewer,
      at: midpoint,
    },
    ...(note
      ? [
          {
            id: `${id}-note`,
            type: "note",
            body: note,
            author: reviewer,
            at: midpoint,
          },
        ]
      : []),
    ...(["contacted", "completed"].includes(status)
      ? [
          {
            id: `${id}-contact`,
            type: "contact",
            body: restaurant
              ? "Called the restaurant contact and discussed the menu, service area, and next steps."
              : "Sent an introductory email and asked for availability for a short conversation.",
            channel: restaurant ? "phone" : "email",
            author: reviewer,
            at: updated,
          },
        ]
      : []),
    ...(status !== "in_review"
      ? [
          {
            id: `${id}-status`,
            type: "status",
            body: `Status changed to ${statusWords[status]}.`,
            status,
            author: reviewer,
            at: updated,
          },
        ]
      : []),
  ];
}

const initialCandidates = [
  [
    "olivia",
    "Olivia Bennett",
    "preview-support",
    "",
    "new",
    "16",
    "07:25",
    "Three years in customer support. I enjoy resolving delivery issues and improving help-center articles.",
  ],
  [
    "daniel",
    "Daniel Kovalenko",
    "preview-partners",
    "",
    "in_review",
    "15",
    "13:40",
    "Managed onboarding for a group of independent restaurants. Available for an introductory call next week.",
  ],
  [
    "sophie",
    "Sophie Miller",
    "preview-operations-coordinator",
    "",
    "contacted",
    "15",
    "09:15",
    "I coordinate a small logistics team and work confidently with delivery schedules and reporting.",
  ],
  [
    "max",
    "Max Hrytsenko",
    null,
    "Kyiv",
    "new",
    "14",
    "15:05",
    "Available for evening and weekend deliveries. I have my own bicycle.",
  ],
  [
    "emma",
    "Emma Wilson",
    "preview-support",
    "",
    "completed",
    "13",
    "08:50",
    "Experienced in live chat and email support. Comfortable working with a busy order queue.",
  ],
  [
    "liam",
    "Liam Petrenko",
    "preview-partners",
    "",
    "rejected",
    "12",
    "11:30",
    "Interested in helping local restaurants reach new customers.",
  ],
  [
    "mia",
    "Mia Turner",
    null,
    "Dnipro",
    "in_review",
    "11",
    "10:10",
    "Looking for flexible courier shifts. Two years of delivery experience.",
  ],
  [
    "noah",
    "Noah Bondar",
    "preview-operations-coordinator",
    "",
    "new",
    "10",
    "14:45",
    "Previously worked in dispatch and route planning for a regional grocery service.",
  ],
];

function createCandidate({
  id,
  name,
  vacancyId,
  city = "",
  status,
  createdAt,
  comment,
  index,
}) {
  const role = candidateVacancyReferences.find((item) => item._id === vacancyId);
  const kind = vacancyId ? "team" : "courier";
  const updatedAt =
    status === "new"
      ? createdAt
      : new Date(
          Math.min(
            Date.parse(createdAt) + (2 + (index % 4)) * 86400000,
            Date.parse(timestamp("16", "08:00")),
          ),
        ).toISOString();
  const note =
    status === "in_review"
      ? [
          "Review experience with the hiring manager before scheduling a call.",
          "Resume reviewed. Check availability and confirm the next interview slot.",
          "Relevant background; ask for an example of a recent service improvement.",
        ][index % 3]
      : status === "contacted"
        ? "Introductory email sent. Waiting for preferred interview times."
        : status === "completed"
          ? "Hiring conversation completed. Next steps confirmed with the candidate."
          : status === "rejected"
            ? "Experience does not match the current role requirements. Feedback prepared."
            : "";
  const recordId = `candidate-${id}`;
  const activity = recordActivity(recordId, status, createdAt, updatedAt, note);
  return {
    _id: recordId,
    kind,
    vacancy_id: vacancyId,
    vacancy_title: role?.title || "Delivery Courier",
    ...(kind === "courier" ? { city } : {}),
    applicant_name: name,
    email: `${id}@example.com`,
    phone:
      index > 7 && kind === "team" && index % 5 === 0
        ? ""
        : `+38050${String(1000010 + index)}`,
    resume_url: vacancyId ? `https://example.com/resumes/${id}` : "",
    portfolio_url: role?.portfolio_field_enabled
      ? `https://example.com/portfolios/${id}`
      : "",
    comment,
    application_status: status,
    internal_note: note,
    revision: 0,
    consent_at: createdAt,
    createdAt,
    updatedAt,
    history: activity
      .filter((item) => item.type === "status")
      .map(({ status: nextStatus, author, at }) => ({
        status: nextStatus,
        author,
        at,
      })),
    activity,
  };
}

const initialRestaurants = [
  [
    "olive",
    "Olive & Ember",
    "Kyiv",
    "Anna Shevchenko",
    "new",
    "16",
    "08:35",
    "We serve seasonal Mediterranean food and would like to launch delivery for our lunch menu. We can share menu photos and packaging details this week.",
  ],
  [
    "grain",
    "Grain House Bakery",
    "Lviv",
    "Marko Lewis",
    "in_review",
    "15",
    "12:10",
    "Interested in breakfast delivery. Our pastries are ready from 7 am, and we can prepare preorders for nearby offices.",
  ],
  [
    "tide",
    "Tide Kitchen",
    "Odesa",
    "Sofia Bondar",
    "new",
    "15",
    "10:45",
    "Please send your restaurant onboarding checklist.",
  ],
  [
    "basil",
    "Basil & Brick",
    "Dnipro",
    "Daniel Marchenko",
    "completed",
    "14",
    "14:20",
    "We run two neighborhood pizza kitchens. We would like to start with our central location, then add the second kitchen once the team is comfortable with the order flow. Please let us know whether we can manage both menus from one account and set different opening hours.",
  ],
  [
    "miso",
    "Miso Garden",
    "Vinnytsia",
    "Emily Carter",
    "in_review",
    "13",
    "09:05",
    "Our Japanese-inspired menu travels well. We are reviewing delivery partners for a November launch.",
  ],
  [
    "copper",
    "Copper Cup",
    "Ivano-Frankivsk",
    "Oliver Melnyk",
    "completed",
    "12",
    "07:50",
    "Coffee, brunch, and desserts. Happy to arrange a call on Tuesday afternoon.",
  ],
];
const restaurantNames = [
  "Juniper Table",
  "Saffron Street",
  "Maple Kitchen",
  "Pasta District",
  "The Little Fig",
  "Northside Burgers",
  "Hearth & Honey",
  "Green Fork",
  "Nori & Rice",
  "The Roasted Bean",
  "Apricot Bakery",
  "Market Bowl",
  "Wild Thyme",
  "Stone Oven",
  "Lemon Grove",
  "Urban Dumpling",
  "Sunday Brunch",
  "Cedar Grill",
  "Salt & Sage",
  "Poppy Cafe",
  "Bluebird Kitchen",
  "The Soup Room",
  "Amber Noodles",
  "Oak & Pepper",
  "Morning Ritual",
  "Peach Pantry",
  "Bamboo Wok",
  "The Toast House",
  "Riverbank Bistro",
  "Golden Crust",
  "Chili & Lime",
  "Meadow Kitchen",
  "Sesame Corner",
  "The Daily Plate",
  "Fable Coffee",
  "Flour & Butter",
  "Harbor Sushi",
  "The Honest Burger",
  "Plum & Rye",
  "Rosemary Deli",
  "Gather Kitchen",
  "The Lunch Club",
  "Willow Bakery",
  "Firestone Pizza",
  "Little Lotus",
  "Bean & Bloom",
  "Orchard Table",
  "The Curry Room",
  "Dough Society",
  "Mango Kitchen",
  "Clover Cafe",
  "The Salad Bar",
  "Bistro Eleven",
  "Pearl Dumplings",
  "Pine & Plate",
  "Bun Theory",
  "Early Bird",
  "Truffle Corner",
  "Wheat & Water",
  "The Bento Box",
  "Summer Kitchen",
  "Cinnamon House",
  "Copper Spoon",
  "Red Pepper",
  "Honeycomb Cafe",
  "The Dumpling Yard",
  "Olive Branch",
  "Mint Kitchen",
  "Sourdough Studio",
  "Parkside Pizza",
  "The Green Spoon",
  "Atlas Kitchen",
  "Cocoa & Cream",
  "Moss Cafe",
  "Harvest Bowl",
  "Noodle Workshop",
  "The Good Wrap",
  "Fig & Fennel",
  "Steam House",
  "Daily Bread",
  "Ginger Kitchen",
  "The Breakfast Room",
  "Chester Grill",
  "Sunflower Deli",
];
const restaurantComments = [
  "We would like to offer our full lunch menu for delivery. Could you share your commission structure and the usual onboarding timeline?",
  "Please contact us to discuss a partnership.",
  "We are opening a second location next month and want to arrange delivery before the launch. Our menu includes family meals and individual portions. We can provide photographs, ingredient information, and opening hours this week.",
  "Our team is ready to start with a smaller delivery menu. We would appreciate guidance on packaging requirements.",
  "We currently accept phone orders and would like to reach more customers through your platform. Please call after 2 pm, outside the lunch rush.",
  "Interested in breakfast and office catering delivery. We prepare orders from 7:30 am and can offer scheduled pickup times.",
  "Could we schedule a short call? We have a seasonal menu and would like to understand how frequently it can be updated.",
  "We serve vegetarian and vegan dishes and already have delivery-friendly packaging. Our kitchen can prepare around 25 additional orders per hour. We would like to discuss service coverage, menu setup, and expected launch requirements.",
  "Looking for a delivery partner for our evening service, Thursday through Sunday.",
  "We operate three neighborhood locations. Can your team help us decide whether to launch them together or start with one kitchen?",
];

function createRestaurant({
  id,
  name,
  city,
  contact,
  status,
  createdAt,
  comment,
  index,
}) {
  const updatedAt =
    status === "new"
      ? createdAt
      : new Date(
          Math.min(
            Date.parse(createdAt) + (1 + (index % 5)) * 86400000,
            Date.parse(timestamp("16", "08:00")),
          ),
        ).toISOString();
  const note =
    status === "in_review"
      ? [
          "Menu received. Confirm opening hours and packaging before the onboarding call.",
          "Waiting for the contact person to confirm kitchen capacity and preferred launch date.",
          "Review delivery coverage with the city operations team.",
        ][index % 3]
      : status === "completed"
        ? "Initial review completed and onboarding information shared."
        : "";
  const recordId = `restaurant-${id}`;
  return {
    _id: recordId,
    restaurant_name: name,
    city,
    contact_name: contact,
    phone: `+38067${String(2000010 + index)}`,
    email: `${id}@example.com`,
    website: index > 5 && index % 7 === 0 ? "" : `https://example.com/${id}`,
    comment,
    status,
    internal_note: note,
    revision: 0,
    consent_at: createdAt,
    createdAt,
    updatedAt,
    activity: recordActivity(
      recordId,
      status,
      createdAt,
      updatedAt,
      note,
      true,
    ),
  };
}

export function createAdminRecords() {
  const applications = initialCandidates.map(
    ([id, name, vacancyId, city, status, day, time, comment], index) =>
      createCandidate({
        id,
        name,
        vacancyId,
        city,
        status,
        createdAt: timestamp(day, time),
        comment,
        index,
      }),
  );
  const availableRoles = candidateVacancyReferences.filter(
    (item) => item.publication_status !== "draft",
  );
  const candidateStatuses = [
    "new",
    "in_review",
    "new",
    "contacted",
    "in_review",
    "completed",
    "new",
    "rejected",
    "contacted",
    "completed",
  ];
  for (let index = applications.length; index < 150; index += 1) {
    const isCourier = index % 4 === 0;
    const role = availableRoles[(index * 7) % availableRoles.length];
    const name = `${firstNames[index % firstNames.length]} ${lastNames[(index * 7 + Math.floor(index / firstNames.length)) % lastNames.length]}`;
    applications.push(
      createCandidate({
        id: `application-${String(index + 1).padStart(3, "0")}`,
        name,
        vacancyId: isCourier ? null : role._id,
        city: isCourier ? cities[index % 8] : "",
        status: candidateStatuses[index % candidateStatuses.length],
        createdAt: dayAt(
          (index * 11) % 41,
          7 + (index % 13),
          (index * 17) % 60,
        ),
        comment: isCourier
          ? courierComments[Math.floor(index / 4) % courierComments.length]
          : candidateComments[index % candidateComments.length],
        index,
      }),
    );
  }
  const partnerships = initialRestaurants.map(
    ([id, name, city, contact, status, day, time, comment], index) =>
      createRestaurant({
        id,
        name,
        city,
        contact,
        status,
        createdAt: timestamp(day, time),
        comment,
        index,
      }),
  );
  const restaurantStatuses = [
    "new",
    "in_review",
    "new",
    "completed",
    "in_review",
    "new",
    "completed",
  ];
  for (let index = partnerships.length; index < 90; index += 1) {
    const name = restaurantNames[index - initialRestaurants.length];
    partnerships.push(
      createRestaurant({
        id: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
        name,
        city: cities[(index * 3) % cities.length],
        contact: `${firstNames[(index * 5) % firstNames.length]} ${lastNames[(index * 11) % lastNames.length]}`,
        status: restaurantStatuses[index % restaurantStatuses.length],
        createdAt: dayAt(
          (index * 13) % 41,
          7 + (index % 12),
          (index * 19) % 60,
        ),
        comment: restaurantComments[index % restaurantComments.length],
        index,
      }),
    );
  }
  return { applications, partnerships };
}
