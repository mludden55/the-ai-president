export interface Topic {
  id: string;
  title: string;
  description: string;
  /*questions: string[];*/
}

export const TOPICS: Topic[] = [
  // The following are The Big Board questions
  {
    id: 'gun-control',
    title: 'Gun Control',
    description: `<em>Public Consensus:</em> A majority of Americans support measures like universal background checks and red flag laws.
    <br>
    <em>Policy Gap:</em> Despite high public support, significant federal legislation has stalled, often due to strong opposition from gun rights advocates and lobbying groups.`
  },
  {
    id: 'climate-change',
    title: 'Climate Change',
    description: `<em>Public Consensus:</em> Many Americans recognize climate change as a serious threat and support policies to address it, such as renewable energy investments.
    <br>
    <em>Policy Gap:</em> Legislative efforts to enact comprehensive climate action have been hindered by partisan divides and economic concerns.`
  },
  {
    id: 'healthcare-access',
    title: 'Healthcare Access',
    description: `<em>Public Consensus:</em> There is widespread support for expanding access to healthcare and reducing costs, including options like Medicare for All.
    <br>
    <em>Policy Gap:</em> Legislative proposals face resistance from some political factions, influenced by concerns over costs and the role of private insurance.`
  },
  {
    id: 'justice-reform',
    title: 'Criminal Justice Reform',
    description: `<em>Public Consensus:</em> Many Americans advocate for reforms such as reducing mandatory minimum sentences and addressing racial disparities in policing.
    <br>
    <em>Policy Gap:</em> While some local reforms have occurred, comprehensive federal legislation has struggled to gain traction amidst political polarization.`
  },
  {
    id: 'infrastructure-investment',
    title: 'Infrastructure Investment',
    description: `<em>Public Consensus:</em> A strong majority supports increased funding for infrastructure projects, including roads, bridges, and public transit.
    <br>
    <em>Policy Gap:</em> Legislative efforts can be stalled by budgetary concerns and disagreements over funding sources.`
  },
  {
    id: 'immigration-reform',
    title: 'Immigration Reform',
    description: `<em>Public Consensus:</em> Many Americans support a pathway to citizenship for undocumented immigrants and comprehensive immigration reform.
    <br>
    <em>Policy Gap:</em> Political gridlock and differing opinions on enforcement versus humanitarian approaches have stalled progress.`
  },
  {
    id: 'family-leave',
    title: 'Paid Family Leave',
    description: `<em>Public Consensus:</em> A significant portion of the public supports paid family leave policies for new parents and caregivers.
    <br>
    <em>Policy Gap:</em> Legislative efforts have faced challenges in terms of funding and opposition from some business groups concerned about potential costs.`
  },
  {
    id: 'voting-rights',
    title: 'Voting Rights',
    description: `<em>Public Consensus:</em> There is broad support for measures to protect and expand voting access, such as automatic voter registration and eliminating voter ID laws.
    <br>
    <em>Policy Gap:</em> Legislative initiatives have been blocked by partisan disputes and concerns over election integrity.`
  },
  {
    id: 'minimum-wage',
    title: 'Minimum Wage Increase',
    description: `<em>Public Consensus:</em> A majority of Americans support raising the federal minimum wage to address living costs and economic inequality.
    <br>
    <em>Policy Gap:</em> Efforts to raise the minimum wage have faced strong opposition in Congress, often framed around economic concerns and potential job losses.`
  },
  {
    id: 'prescription-drug',
    title: 'Prescription Drug Pricing',
    description: `<em>Public Consensus:</em> Many Americans favor policies aimed at reducing prescription drug prices and increasing transparency.
    <br>
    <em>Policy Gap:</em> Legislative measures have stalled due to lobbying by pharmaceutical companies and debates over the best approach to price regulation.`
  },

  // The following are Current Events questions 
  // Important, the topic below must always be #11 (#10 in array)
  {
    id: 'utility-costs',
    title: 'Rising Utility Costs',
    description:
      'Rising utility rates and energy costs, with average utility bills rising over 10 percent in 2025 alone, emerging as a major electoral issue that has influenced state and local elections.',
  },
  {
    id: 'government-corruption',
    title: 'Government Corruption Concerns',
    description:
      'Government corruption as a top public worry, with 54 percent of Americans reporting significant concern, alongside worries about disruption of federal government services. Yale Program on Climate Change Communication',
  },
  {
    id: 'homeowners-insurance',
    title: 'Homeowners Insurance Market Crisis',
    description:
      'Homeowners insurance market crisis, with insurers pulling back from disaster-prone states, leaving homeowners without adequate protection sources in California, Florida, and other areas.',
  },
  {
    id: 'federal-ai-regulation',
    title: 'Federal-State AI Regulation Conflict',
    description:
      'Federal-state conflict over AI regulation, with multiple state AI laws taking effect January 1, 2026, while the Trump administration signed an executive order in December 2025 to challenge and preempt state AI regulations.',
  },
  {
    id: 'food-safety',
    title: 'Food Safety and Dietary Regulations',
    description:
      'Food safety and dietary regulations including state-level bans on certain food dyes (75 bills in 37 states in 2025), fluoride restrictions, and limitations on food stamp purchases for certain unhealthy products.',
  },
  {
    id: 'medicaid-coverage',
    title: 'Medicaid Coverage Losses and Healthcare Premiums',
    description:
      'State Medicaid coverage losses and healthcare premium spikes, with the Urban Institute estimating 6 million Americans in expansion states could lose coverage in 2026 following federal funding changes.',
  },
  {
    id: 'school-funding',
    title: 'School Funding and Education Culture Wars',
    description:
      'School funding and education culture wars, with federal and state policy debates over public school funding, transgender student rights, parental curriculum input, and DEI initiatives amid ongoing teacher shortages.',
  }, 
  {
    id: 'stateof-democracy',
    title: 'State of Democracy and Cultural Divisions',
    description:
      'Concerns about the state of democracy and cultural/social divisions, with 44 percent and 36 percent of Americans respectively reporting significant worry about these issues.',
  },   
  {
    id: 'budget-crises',
    title: 'State and Federal Budget Crises',
    description:
      'State and federal budget crises triggered by federal tax policy changes, with Colorado and other states experiencing unexpected revenue shortfalls requiring emergency legislative sessions to address funding gaps.',
  },
  {
    id: 'ai-insurance-regulation',
    title: 'AI Insurance Regulation',
    description:
      'AI insurance regulation emerging as a priority, with bipartisan concern from state lawmakers about how AI affects insurance markets and pricing, particularly for homeowners and property insurance.',
  }   
  // The following are politician question
  /*{
    id: 'politician',
    title: 'Data Privacy',
    description:
      'Politicians that champion specific causes.',
  } */         
];
