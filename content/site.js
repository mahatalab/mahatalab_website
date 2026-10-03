/* ============================================================
   MAHATA LAB — WEBSITE CONTENT  (the only file you edit)
   Change the text between the "quotes" and save. Do not remove
   quotes, commas or brackets. Paragraphs use <p>…</p>, bold uses
   <b>…</b>, lists use <ul><li>…</li></ul>.
   Find a section by searching for its name:
     "settings"     lab name, header subtitle, logo paths, footer quote, developed/maintained by
     "home"         hero heading, sub-heading, About the lab text
     "news"         "items": copy one { … } block to add news (top = newest)
     "research"     "themes": the 3 research sections + their pictures
     "publications" "items": copy one { … } block per paper
     "team"         "groups": PI, PhD Students, Master Students
     "gallery"      "photos": add { "image": "assets/uploads/x.jpg", "caption": "" }
     "contact"      address, email, Join the Lab text
   Pictures: put the file in assets/uploads/ and write its path,
   e.g. "assets/uploads/photo1.jpg".
   ============================================================ */
window.SITE_DATA = {
  "settings": {
    "labName": "Mahata Lab",
    "headerSubtitle": "Bacteria and Phage Genetics Lab",
    "tagline": "Bacteria and Phage Genetics Lab | NISER Bhubaneswar",
    "siteTitle": "Mahata Lab — Bacteria and Phage Genetics, NISER Bhubaneswar",
    "description": "The Mahata Lab at NISER Bhubaneswar studies the molecular arms race between bacteria and bacteriophages: bacterial immune systems, phage counter-defense and phage-encoded antimicrobials.",
    "logo": "assets/img/mahata-lab-logo wo bg.png",
    "institutionLogo": "assets/img/niser-logo wo bg.png",
    "favicon": "assets/img/mahata-lab-logo wo bg.png",
    "footerQuote": "In the fields of observation, chance favors only the prepared mind." -Louis Pasteur,
    "developedBy": "Samchita Sarangi",
    "maintainedBy": "Dr. Tridib Mahata"
  },
  "nav": [
    {
      "label": "Home",
      "route": "home"
    },
    {
      "label": "News",
      "route": "news"
    },
    {
      "label": "Research",
      "route": "research"
    },
    {
      "label": "Publications",
      "route": "publications"
    },
    {
      "label": "Team",
      "route": "team"
    },
    {
      "label": "Gallery",
      "route": "gallery"
    },
    {
      "label": "Contact",
      "route": "contact"
    }
  ],
  "home": {
    "eyebrow": "Microbial Genetics · Molecular Biology · Biochemistry",
    "heading": "The Molecular Arms Race Never Ends",
    "subheading": "Decoding the ancient conflict between bacteria and bacteriophages - a battle billions of years in the making.",
    "buttonText": "Explore our research",
    "buttonRoute": "research",
    "aboutTitle": "About the lab",
    "about": "<p>Our lab explores the fascinating molecular conflict between bacteria and bacteriophages - a never-ending evolutionary arms race that has been ongoing for billions of years, generating an extraordinary arsenal of molecular weapons and defenses. Our aim is to uncover the fundamental mechanisms of this microbial warfare: how phages take over their bacterial hosts, and how bacteria defend themselves against phage attack. In the last couple of years, more than hundered anti-phage defense systems (bacterial immune systems) have been discovered. These systems work either as innate defenses (restriction enzymes, CBASS, GAPS1, GAPS4, GAPS6, etc.) or as memory-based defenses like CRISPR-Cas systems. Using a combination of microbial genetics, molecular biology, genomics, and biochemistry, we investigate this arms race not just to understand it, but to harness it for biotechnology applications. Investigating these molecular battles will help us develop novel antimicrobials, improve phage therapy, design antivirals (thanks to the conservation of immune mechanisms across life), and develop new tools to manipulate bacteria and phages for research and biotechnology.</p>"
  },
  "news": {
    "title": "News",
    "subtitle": "Lab updates and announcements",
    "items": [
      {
        "date": "JUNE 2026",
        "tag": "INTERNSHIP",
        "title": "Three students join the lab through the NISER Student Internship Programme (NSIP)",
        "body": "<ul><li>Priya Roy - Central University of Rajasthan</li><li>Aniket Patra - Chanakya University, Bengaluru</li><li>Sabnam Das - Manipal University, Jaipur</li></ul>"
      },
      {
        "date": "MAY 2026",
        "tag": "GRANT",
        "title": "Dr. Tridib Mahata has been awarded the ANRF–PMECRG grant",
        "body": "<p>The Prime Minister's Early Career Research Grant will fund our work on bacteriophage-encoded antimicrobials.</p>"
      }
    ]
  },
  "research": {
    "title": "Research",
    "themes": [
      {
        "num": "01",
        "title": "Discovery of Novel Bacterial Immune Systems",
        "image": "assets/img/research-1.png",
        "alt": "Bacteriophages attacking a bacterium protected by a shield labelled Bacterial Immune Systems",
        "body": "<p>Bacteria are constantly attacked by bacteriophages. To defend against phage infection, bacteria have evolved both innate immune systems (CBASS, Lamassu, Avs, Gabija, Retrons, GAPS1, GAPS4, and many more) and adaptive immune systems (CRISPR-Cas). Interestingly, many of these immune systems share evolutionary origins with eukaryotic antiviral immune systems. Our lab focuses on discovering novel and ancient immune systems by investigating ‘defense hotspots’ in clinically relevant bacterial pathogens as well as non-model organisms and by exploring \"bacterial dark matter\" using functional metagenomics. We are also interested in understanding how these defense systems are activated by different phage determinants and in elucidating their mechanisms of defense.</p><p>How does a bacterium sense a phage attack? Once infected, its defense systems must detect the threat based on specific molecular signals - like phage DNA, altered nucleotide pools, or disrupted host metabolism. Understanding exactly what these sensors recognize, and how that recognition triggers a defense response, is essential for understanding how bacterial immunity works.</p>"
      },
      {
        "num": "02",
        "title": "Unravelling Phage Counter-Defense Strategies",
        "image": "assets/img/research-2.png",
        "alt": "A phage-encoded inhibitor blocking a bacterial defense protein",
        "body": "<p>Bacteria and phages are locked in a never-ending war that drives a constant evolutionary arms race. To neutralize bacterial defenses, phages have evolved an impressive toolkit of counter-defense strategies. Our lab focuses on identifying phage-encoded inhibitors of bacterial immune systems, understanding their mechanism of action and ultimately exploring these phage-encoded proteins for biotechnology and therapeutic applications.</p>"
      },
      {
        "num": "03",
        "title": "Exploring Phage-Encoded Antimicrobials",
        "image": "assets/img/research-3.png",
        "alt": "Phage-encoded proteins targeting DNA, cell division and metabolism in ESKAPE pathogens",
        "body": "<p>Phage genomes are packed with proteins that disrupt essential bacterial processes- from DNA replication to cell division to metabolism. Despite decades of phage research, only a small fraction of these genes have been studied, leaving a vast, largely uncharacterized reservoir of potential antibacterial weapons. Our lab systematically searches phage genomes, including those from largely unexplored phage families, to identify genes that are toxic to bacteria, determine their antibacterial targets and elucidate their mechanism of action. The ultimate goal is to identify phage proteins that can be developed as novel antibacterial agents against dangerous multidrug-resistant bacteria, including ESKAPE pathogens.</p>"
      }
    ]
  },
  "publications": {
    "title": "Publications",
    "subtitle": "2015–2025",
    "items": [
      {
        "year": "2026",
        "title": "The anti-phage defense system GAPS4 is a double-edged sword that sensitizes bacteria to DNA-damaging agents.",
        "authors": "Mahata T, Kanarek K, Goren MG, Ragavan RM, Haldar A, Shur G, Yehia R, Burstein D, Haitin Y, Qimron U, Salomon D",
        "venue": "Nucleic Acids Research",
        "tag": "in press",
        "note": "",
        "link": ""
      },
      {
        "year": "2024",
        "title": "Gamma-Mobile-Trio systems are mobile elements rich in bacterial defensive and offensive tools",
        "authors": "Mahata T, Kanarek K, Goren MG, Ragavan RM, Bosis E, Qimron U, Salomon D.",
        "venue": "Nature Microbiology 2024, 9, 3268–3283",
        "tag": "",
        "note": "",
        "link": ""
      },
      {
        "year": "2023",
        "title": "Engineering mice for female-biased progeny without impacting genetic integrity and litter size",
        "authors": "Yosef I, Mahata T, Chen Y, Bar-joseph H, Shalgi R, Munitz A, Gerlic M, Qimron U.",
        "venue": "BioRxiv, 2023",
        "tag": "Preprint",
        "note": "",
        "link": ""
      },
      {
        "year": "2023",
        "title": "An efficient, scarless, selection-free technology for phage engineering",
        "authors": "Goren MG, Mahata T, Qimron U.",
        "venue": "RNA Biology 2023, 20(1), 830–835",
        "tag": "",
        "note": "",
        "link": ""
      },
      {
        "year": "2023",
        "title": "Inhibition of Host Cell Division by T5 protein 008 (Hdi)",
        "authors": "Mahata T, Molshanski-Mor S, Goren MG, Kohen-Manor M, Yosef I, Avram O, Salomon D, Qimron U.",
        "venue": "Microbiology Spectrum 2023, 11(6), e01697-23",
        "tag": "",
        "note": "",
        "link": ""
      },
      {
        "year": "2023",
        "title": "Highly active CRISPR adaptation proteins revealed by a robust enrichment technology",
        "authors": "Yosef I,† Mahata T,† Goren MG, Degany OJ, Ben-Shem A, Qimron U.",
        "venue": "Nucleic Acids Research 2023, 51(14), 7552–7562",
        "tag": "",
        "note": "† Equal contributions",
        "link": ""
      },
      {
        "year": "2022",
        "title": "Thou shalt not cleave DNA — only repress transcription: A compact Cas protein representing a new CRISPR-Cas subtype",
        "authors": "Mahata T, Qimron U.",
        "venue": "Molecular Cell 2022, 82(23), 4403–4404",
        "tag": "",
        "note": "",
        "link": ""
      },
      {
        "year": "2022",
        "title": "Cleavage of Abasic Sites in DNA by an Aminoquinoxaline Compound. Augmented Cytotoxicity and DNA Damage in Combination with an Anticancer Drug Chlorambucil in Human Colorectal Carcinoma Cells",
        "authors": "Mandi CS, Mahata T, Patra D, Chakraborty J, Bora A, Pal R, Dutta S.",
        "venue": "ACS Omega 2022, 7(8), 6488–6504",
        "tag": "",
        "note": "",
        "link": ""
      },
      {
        "year": "2021",
        "title": "A phage mechanism for selective nicking of dUMP-containing DNA",
        "authors": "Mahata T, Molshanski-Mor S, Goren MG, Jana B, Kohen-Manor M, Yosef I, Avram O, Pupko T, Salomon D, Qimron U.",
        "venue": "PNAS 2021, 118(23), e2026354118",
        "tag": "",
        "note": "",
        "link": ""
      },
      {
        "year": "2021",
        "title": "Interaction of a Triantennary Quinoline Glycoconjugate with the Asialoglycoprotein Receptor",
        "authors": "Palit S,† Banerjee S,† Mahata T,† Niyogi S, Das T, Mandi CS, Chakrabarty P, Dutta S.",
        "venue": "ChemMedChem 2021, 16(14), 2211–2216",
        "tag": "",
        "note": "† Equal contributions",
        "link": ""
      },
      {
        "year": "2019",
        "title": "Quinoxaline derivatives disrupt the base stacking of hepatitis C virus-internal ribosome entry site RNA: Reduce translation and replication",
        "authors": "Chakraborty J, Kanungo A, Mahata T, Kumar K, Sharma G, Pal R, Ahammed SK, Patra D, Majhi B, Chakrabarti S, Das S, Dutta S.",
        "venue": "Chem. Commun. 2019, 55, 14027–14030",
        "tag": "",
        "note": "",
        "link": ""
      },
      {
        "year": "2018",
        "title": "Intercalator induced DNA superstructure formation: Doxorubicin and a synthetic quinoxaline derivative",
        "authors": "Mahata T, Chakraborty J, Kanungo A, Patra D, Basu G, Dutta S.",
        "venue": "Biochemistry 2018, 57(38), 5557–5563",
        "tag": "",
        "note": "",
        "link": ""
      },
      {
        "year": "2016",
        "title": "The Benzyl Moiety in a Quinoxaline-Based Scaffold Acts as a DNA Intercalation Switch",
        "authors": "Mahata T, Kanungo A, Ganguly S, Modugula EK, Choudhury S, Pal SK, Basu G, Dutta S.",
        "venue": "Angewandte Chemie 2016, 55(27), 7733–7736",
        "tag": "",
        "note": "",
        "link": ""
      },
      {
        "year": "2015",
        "title": "Synthesis of a visibly emissive 9-nitro-2,3-dihydro-1H-pyrimido[1,2-a]quinoxalin-5-amine scaffold with large Stokes shift and live cell imaging",
        "authors": "Kanungo A, Patra D, Mukherjee S, Mahata T, Maulik PR, Dutta S.",
        "venue": "RSC Advances 2015, 5(87), 70958–70967",
        "tag": "",
        "note": "",
        "link": ""
      }
    ]
  },
  "team": {
    "title": "Team",
    "groups": [
      {
        "name": "Principal Investigator",
        "members": [
          {
            "name": "Tridib Mahata, Ph.D.",
            "role": "Assistant Professor",
            "degree": "",
            "email": "tridibmahata@niser.ac.in",
            "photo": "assets/team/pi.jpg",
            "bio": "<p>Ph.D: University of Calcutta (CSIR-IICB), Kolkata (2012–2018)</p><p>Postdoctoral Research: Tel Aviv University, Israel (2019–2025)</p>"
          }
        ]
      },
      {
        "name": "PhD Students",
        "members": [
          {
            "name": "Samchita Sarangi",
            "role": "PhD Student",
            "degree": "M.Sc. NIT Rourkela (GATE XL/BT qualified)",
            "email": "samchita.sarangi@niser.ac.in",
            "photo": "assets/team/samchita.jpg",
            "bio": ""
          },
          {
            "name": "Lalitmohan Kar",
            "role": "PhD Student",
            "degree": "M.Sc. Sambalpur University (CSIR UGC JRF, AIR-74)",
            "email": "lalitmohan.kar@niser.ac.in",
            "photo": "assets/team/lalitmohan.jpg",
            "bio": ""
          }
        ]
      },
      {
        "name": "Master Students",
        "members": [
          {
            "name": "Shubhranshu Behera",
            "role": "Int.MSc Student",
            "degree": "",
            "email": "",
            "photo": "assets/team/shubhranshu.jpg",
            "bio": ""
          },
          {
            "name": "Pratush Kumar Pusti",
            "role": "Int.MSc Student",
            "degree": "",
            "email": "",
            "photo": "assets/team/pratush.jpg",
            "bio": ""
          }
        ]
      }
    ]
  },
  "gallery": {
    "title": "Gallery",
    "message": "Gallery Coming Soon",
    "text": "Photos of the lab, team events, conferences, and experiments will be displayed here.",
    "photos": []
  },
  "contact": {
    "title": "Contact",
    "piLabel": "Principal Investigator",
    "pi": "Dr. Tridib Mahata",
    "labLabel": "Laboratory",
    "lab": "Bacteria and Phage Genetics Lab, School of Biological Sciences",
    "locationLabel": "Location",
    "location": "Rooms 422 and 423 National Institute of Science Education and Research Bhubaneswar, Jatni, Khordha Odisha, India — 752050",
    "emailLabel": "Email",
    "email": "tridibmahata@niser.ac.in",
    "joinTitle": "Join the Lab",
    "join": "<p>We are looking for PhD students and postdocs who are excited by the molecular battle between bacteria and bacteriophages. If you want to discover new bacterial immune systems, decode how phages disarm bacterial immunity, explore bacterial memory formation (CRISPR-Cas adaptation), develop new molecular tools to manipulate bacteria, or hunt for the next generation of antibacterial proteins - we'd like to hear from you.</p><p>You will work at the intersection of microbial genetics, molecular biology, biochemistry, and synthetic biology, with real freedom to pursue your own questions within these themes. No prior phage experience is required.</p>"
  }
};
