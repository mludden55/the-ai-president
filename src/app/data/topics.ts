export interface Topic {
  id: string;
  title: string;
  description: string;
  /*questions: string[];*/
}

export const TOPICS: Topic[] = [
  // The following are Low Hanging Fruit questions
  {
    id: 'climate-change',
    title: 'Climate Change Action',
    description:
      'A significant portion of the population acknowledges the urgency of addressing climate change. However, political action often lags due to economic interests and lobbying from fossil fuel industries.',
  },
  {
    id: 'universal-healthcare',
    title: 'Universal Healthcare',
    description:
      'Many citizens support a move toward universal healthcare, yet political action remains fragmented due to entrenched interests in the healthcare and insurance industries.',
  },
  {
    id: 'affordable-housing',
    title: 'Affordable Housing',
    description:
      'The general population often agrees on the need for affordable housing solutions, yet political solutions are slow to materialize due to zoning laws and real estate interests. This can lead to increased homelessness, urban decay, and social instability.',
  },
  {
    id: 'gun-control',
    title: 'Gun Control',
    description:
      'While there is substantial public support for common-sense gun control measures, political action is often stymied by lobbying from gun rights organizations. Long-term implications include ongoing gun violence, societal trauma, and a fragmented national discourse on safety.',
  },
  {
    id: 'education-reform',
    title: 'Education Reform',
    description:
      'Many people advocate for significant reforms in education, including equitable funding and access to quality education. Political inertia often results from entrenched educational institutions and funding mechanisms. Long-term implications include a workforce that is ill-prepared for future challenges and widening socioeconomic disparities.',
  },
  {
    id: 'income-inequality',
    title: 'Income Inequality',
    description:
      'There is a growing consensus about the need to address income inequality through progressive taxation and social safety nets. However, political will is often lacking due to the influence of wealthy donors and corporations. Long-term implications include social unrest, decreased social mobility, and economic stagnation.',
  },
  {
    id: 'systemic-racism',
    title: 'Systemic Racism',
    description:
      'Persistent racial disparities in areas such as criminal justice, housing, education, and healthcare indicate structural inequities embedded in public policy. While public awareness has grown, legislative responses are often limited by political resistance and uneven implementation. Long-term consequences include reduced economic participation, continued social stratification, and weakened trust in public institutions.',
  },
  {
    id: 'mental-health',
    title: 'Mental Health',
    description:
      'There is broad agreement on the need for improved mental health services, yet funding and policy changes are often inadequate. Long-term implications include increased healthcare costs, societal stigma, and a growing burden on social services.',
  },
  {
    id: 'voting-rights',
    title: 'Voting Rights',
    description:
      'Many citizens believe in the importance of protecting and expanding voting rights, but political action is frequently impeded by partisan interests. Long-term implications include diminished democratic participation, potential disenfranchisement, and erosion of public trust in governance.'
  },
  {
    id: 'infrastructure-investment',
    title: 'Infrastructure Investment',
    description:
      'There is a general consensus on the need for significant investment in infrastructure, yet political gridlock often prevents action. Long-term implications include deteriorating public services, economic inefficiency, and potential safety hazards.',
  }, 
  // The following are Current Events questions 
  {
    id: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    description:
      'Rapid deployment of generative AI has raised concerns about workforce displacement, misinformation, and the lack of clear regulatory guardrails.',
  },
  {
    id: 'insurance-affordability',
    title: 'Insurance Affordability',
    description:
      'Rising home and auto insurance premiums, especially in disaster-prone regions, have become a major household cost concern and a policy challenge for states.',
  },
  {
    id: 'election-administration',
    title: 'Election Administration',
    description:
      'Ongoing debates focus on election security, ballot access, and the capacity of state and local systems to manage high-turnout elections.',
  },
  {
    id: 'housing-affordability',
    title: 'Housing Affordability',
    description:
      'Elevated interest rates, housing shortages, and reassessments have intensified public pressure for near-term housing and tax relief measures.',
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain',
    description:
      'Recent disruptions and geopolitical risks have renewed attention on reshoring, critical materials, and industrial policy effectiveness.',
  },
  {
    id: 'energy-grid',
    title: 'Energy Grid',
    description:
      'Extreme weather events have exposed vulnerabilities in aging energy infrastructure, prompting concern over reliability and preparedness.',
  },
  {
    id: 'data-privacy',
    title: 'Data Privacy',
    description:
      'High-profile breaches and expanded data collection by platforms have increased demand for stronger privacy standards and enforcement.',
  },   
  // The following are politician question
  {
    id: 'politician',
    title: 'Data Privacy',
    description:
      'Politicians that champion specific causes.',
  }           
];
