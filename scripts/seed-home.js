/*
 * All content & links mirrored from https://avanthienggcollege.ac.in/
 * Edit this file to update notices, events, menus etc. — the pages render from it.
 */
const SITE = "https://avanthienggcollege.ac.in";
const u = (p) => SITE + p; // absolute link to the original site

const DATA = {
  college: {
    name: "Avanthi Institute of Engineering & Technology",
    short: "AIETM",
    tagline: "Top Engineering College Narsipatnam",
    address:
      "Tamaram, Makavarapalem (M), Narsipatnam (RD), Visakhapatnam (Dist), Andhra Pradesh",
    contactAddress:
      "Near Thagarapuvalasa, Vizianagaram District, Andhra Pradesh, 531162, India.",
    admissionPhone: "+91-9866664636",
    otherPhone: "+91-08933 226739",
    fax: "+91 08933 226739",
    email: "principal_aiet@yahoo.com",
  },

  popup: u("/assets/a/popup10.jpeg"),

  /* ---------- Main navigation (mega menu) ---------- */
  nav: [
    { label: "Home", href: "index.html" },
    {
      label: "About",
      groups: [
        {
          title: "Institution",
          links: [
            ["About Us", "about.html"],
            ["Founder & Leadership", u("/founder")],
            ["Principal", "principal.html"],
            ["Dean of Academics", u("/deanofacademics")],
            ["Organisation Chart", u("/org")],
            ["Committees", u("/commeitte")],
            ["Grievance & Leadership", u("/grevience_leadership")],
          ],
        },
        {
          title: "Governance & Disclosures",
          links: [
            ["Governing Body", u("/assets/pdf/goverrning3.pdf")],
            ["Academic Council", u("/assets/pdf/a/A%20C%20COUNCIL.pdf")],
            ["Finance Committee", u("/assets/pdf/a/FINANCE%20COMMITTEE-1.pdf")],
            ["HR Policies", u("/assets/pdf/hrpolicies.pdf")],
            ["RTI Declaration", u("/assets/pdf/aietm-rti%20declaration-2022.pdf")],
            ["Strategic Planning 2025", u("/assets/a/AIETM-Strategic%20Planning-2025.pdf")],
            ["Mandatory Disclosure", u("/assets/pdf/30-MANDATORY%20DISCLOSURE.pdf")],
            ["NAAC SSR", u("/assets/pdf/AIETM_NAAC_SSR.pdf")],
          ],
        },
      ],
    },
    {
      label: "Academics",
      groups: [
        {
          title: "Programmes",
          links: [
            ["Courses Offered", "courses.html"],
            ["PG Courses", u("/pg-courses")],
            ["AICTE Approved List", u("/aicte_apporvedlist")],
            ["Faculty List", u("/faculties_list")],
            ["List of Faculty", u("/list_of_faculty")],
            ["Faculty Appraisal", u("/faculty_appraisal")],
            ["ICT Facilities", u("/ictf_facilities")],
          ],
        },
        {
          title: "Curriculum",
          links: [
            ["Curriculum Planning", u("/curriculam_planing")],
            ["Academic Flexibility", u("/academic_flixbility")],
            ["Curriculum Analysis", u("/curriculumanalysis")],
            ["Curriculum Enrichment", u("/curriculam_enrichment")],
            ["Academic Regulations", u("/academic_regulation")],
            ["Feedback System", u("/feedback_system")],
            ["Course Outcomes", u("/course_outcomes")],
            ["Student Centric Methods", u("/Students_Centric_Methods")],
            ["Credit Distribution", u("/assets/pdf/a/credit%20distribution.pdf")],
            ["Industry Integrated Courses", u("/assets/pdf/a/industry%20integrated%20courses.pdf")],
          ],
        },
      ],
    },
    {
      label: "Departments",
      groups: [
        {
          title: "B.Tech & PG",
          links: [
            ["Computer Science & Engg.", u("/cse_department")],
            ["CSE (AI & ML)", u("/csm_department")],
            ["Electronics & Communication", u("/ece_department")],
            ["Electrical & Electronics", u("/eee_department")],
            ["Mechanical Engineering", u("/mech_department")],
            ["MBA", u("/mba_department")],
            ["Humanities & Basic Sciences", u("/h_bs_department")],
          ],
        },
        {
          title: "M.Tech",
          links: [
            ["M.Tech VLSI", u("/mtechvls")],
            ["M.Tech CSE", u("/mtechcse")],
            ["M.Tech Power Electronics", u("/mtechpe")],
            ["M.Tech DECS", u("/mtechdec")],
          ],
        },
      ],
    },
    {
      label: "Examinations",
      groups: [
        {
          title: "Exam Cell",
          links: [
            ["Controller of Examinations", u("/controllerofexamination")],
            ["Asst. Controller of Examinations", u("/asstcontrollerofexamination")],
            ["Examinations", u("/exams")],
            ["Results", u("/results")],
            ["JNTUGV Results Portal", "https://exams.jntugv.edu.in/results"],
          ],
        },
        {
          title: "Programme-wise",
          links: [
            ["B.Tech", u("/btechh")],
            ["M.Tech", u("/mtechh")],
            ["MBA", u("/mbaa")],
            ["MCA", u("/mcaa")],
          ],
        },
      ],
    },
    {
      label: "Research",
      groups: [
        {
          title: "Research",
          links: [
            ["Research Centres", u("/researchcenters")],
            ["Workshops", u("/workshops")],
            ["Papers", u("/paper")],
            ["Conferences", u("/conferences")],
            ["Research Achievements 2025", u("/assets/a/AIETM-Research%20Achievements%20of%20the%20Institute%202025.pdf")],
          ],
        },
        {
          title: "Innovation",
          links: [
            ["Linkages", u("/linkages")],
            ["MoU", u("/mou")],
            ["Awards", u("/awards")],
            ["Ecosystem", u("/ecosystem")],
            ["Incubation", u("/incubation")],
            ["Grants", u("/Grants")],
            ["Patents", u("/patents")],
          ],
        },
      ],
    },
    {
      label: "Campus",
      groups: [
        {
          title: "Facilities",
          links: [
            ["Infrastructure", u("/infrastracture")],
            ["Physical Facilities", u("/physical_facilities")],
            ["General Facilities", u("/general_facilities")],
            ["Sports", u("/sports")],
            ["Welfare", u("/welfare")],
          ],
        },
        {
          title: "Library",
          links: [
            ["Library Facilities", u("/library_facilities")],
            ["About Library", u("/about_library")],
            ["SOUL", u("/soul")],
            ["Digital Library", u("/digital_library")],
            ["Online e-Journals", u("/online_ejournals")],
          ],
        },
        {
          title: "Student Life",
          links: [
            ["NSS", u("/nss")],
            ["NCC", u("/ncc")],
            ["Photo Gallery", "gallery.html"],
            ["Alumni", u("/alumni")],
            ["Electoral Literacy Club", u("/electoral")],
            ["Scholarship", u("/scholarship")],
            ["Anti Sexual Harassment", u("/anti_sexual_harasssment")],
          ],
        },
      ],
    },
    {
      label: "Placements",
      groups: [
        {
          title: "Training & Placement",
          links: [
            ["Placements", u("/placements")],
            ["Placements 2025-26", u("/placements25_26")],
            ["Placement Records", u("/placementts")],
            ["Companies", u("/companies")],
            ["Career Guidance", u("/career-guidence")],
            ["Capacity Building", u("/capacity_building")],
            ["Qualified (Competitive Exams)", u("/qualified")],
            ["Industrial Visits", u("/industrial_visits")],
          ],
        },
      ],
    },
    {
      label: "IQAC",
      groups: [
        {
          title: "Quality Assurance",
          links: [
            ["IQAC", u("/iqac")],
            ["IQAC 2024", u("/iqac2024")],
            ["Best Practices", u("/best_practices")],
            ["Institutional Distinctiveness", u("/institutional_distinctiveness")],
            ["Code of Conduct", u("/codeofconduct")],
            ["Audit", u("/audit")],
            ["Extension Activities", u("/ExtensionActivities")],
          ],
        },
        {
          title: "Values & Environment",
          links: [
            ["Gender Equality", u("/gender-equality")],
            ["Green Campus", u("/greencampus")],
            ["Energy", u("/energy")],
            ["Waste Management", u("/waste")],
            ["Water Conservation", u("/water")],
            ["Divyangjan Friendly", u("/disabled")],
            ["Institutional Values", u("/institutional_values")],
          ],
        },
      ],
    },
    { label: "Contact", href: "contact.html" },
  ],

  /* ---------- Quick action links ---------- */
  quick: [
    { label: "Alumni Meet Registration", href: "https://forms.gle/1eTzLudk16qEtA4H8", icon: "users", hot: true },
    { label: "College Virtual Tour", href: "https://www.youtube.com/watch?si=618B4ja9Oin36XKI&v=upLx49pBJmY&feature=youtu.be", icon: "play" },
    { label: "ECAP Login", href: "https://webprosindia.com/avanthinrpm", icon: "login" },
    { label: "Fee Online Payment", href: "https://easypay.axisbank.co.in/easyPay/makePayment?mid=NDY4ODY%3D", icon: "card" },
    { label: "Grievance", href: "https://forms.gle/J7Sa9tUyxgmvaBfx9", icon: "chat" },
  ],

  hero: [
    u("/assets/popban/pop4.jpg"),
    u("/assets/images/page28/3.jpeg"),
    u("/assets/images/carousel-images/A++_Apprec3.jpeg"),
    u("/assets/images/page26/1.jpeg"),
    u("/assets/images/page30/15.jpeg"),
  ],

  award: {
    images: [
      u("/assets/popban/pop4.jpg"),
      u("/assets/images/carousel-images/A++_Apprec3.jpeg"),
      u("/assets/images/carousel-images/A++_Apprec1.jpeg"),
      u("/assets/images/carousel-images/A++_Apprec2.jpeg"),
    ],
    text:
      "Dr. C Mohan Rao, Principal, AIETM has received honour and Appreciation award from Sri. Botcha Satyanarayana, Hon'ble Minister for Education, Govt. Of AP in a function organised by APSCHE at Vijayawada on 10th Oct 2023 for achieving NAAC A+ grade to our college.",
  },

  /* ---------- Exam Results ---------- */
  results: [
    ["2026", "JNTUGV: RESULTS of the MCA IV SEM REGULAR & SUPPLEMENTARY EXAMINATIONS APRIL/MAY 2026, LAST DATE FOR REVALUATION IS 14-06-2026.", "https://exams.jntugv.edu.in/results"],
    ["2026", "JNTUGV: results for III B.Tech II Semester (R23) Regular & Supplementary Examinations held in March/April 2026", "https://exams.jntugv.edu.in/results"],
    ["2026", "JNTUGV: results of the III B.Tech II Semester (R23/R20/R19/R16) Regular & Supplementary Examinations held in March/April 2026 released", "https://exams.jntugv.edu.in/results"],
    ["2026", "JNTUGV Results of - III B.Tech I Semester (R23/R20/R19/R16) Supplementary Examinations held in March/April 2026 have been released", "https://exams.jntugv.edu.in/results"],
    ["2026", "JNTUGV Released Results of IV B Tech I Semester Advanced Supplementary Examinations-R20 Regulations held in February 2026", "https://exams.jntugv.edu.in/results"],
    ["2026", "JNTUGV Revaluation results of II B Tech I Semester Regular/Supplementary Examinations-R23,R20,R19&R16 Regulations held in November 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "Results of II-II (R23/R20/R19/R16) B.TECH SUPPLY Examinations- (JNTUGV) held in Nov- 2025 is released", "https://exams.jntugv.edu.in/results"],
    ["2025", "Results of III-I (R20 & R19) and III-II (R19 & R16) Supplementary Examinations- (JNTUGV) held in Nov- 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "I B Tech I Sem ( R20) Supplementary End Exam Time Table Dec 25/Jan 26", u("/assets/a/1-1%20R20%20TT-JNTUGV.pdf")],
    ["2025", "I B Tech I Sem ( R23) Regular/ Supplementary End Exam Time Table Dec 25/Jan 26", u("/assets/a/1-1%20R23%20TT-JNTUGV.pdf")],
    ["2025", "I B Tech II Sem ( R19) Supplementary End Exam Time Table Dec 25/Jan 26", u("/assets/a/1-2%20R19%20TT-JNTUGV.pdf")],
    ["2025", "I B Tech II Sem ( R16) Supplementary End Exam Time Table Dec 25/Jan 26", u("/assets/a/1-2%20R16%20TT-JNTUGV.pdf")],
    ["2025", "I B Tech II Sem ( R23) Supplementary End Exam Time Table Dec 25/Jan 26", u("/assets/a/1-2%20R23%20TT-JNTUGV.pdf")],
    ["2025", "I B Tech I Sem ( R16) Supplementary End Exam Time Table Dec 25/Jan 26", u("/assets/a/1-1%20R16%20TT-JNTUGV.pdf")],
    ["2025", "I B Tech II Sem ( R20) Supplementary End Exam Time Table Dec 25/Jan 26", u("/assets/a/1-2%20R20%20TT-JNTUGV.pdf")],
    ["2025", "I B Tech I Sem ( R19) Supplementary End Exam Time Table Dec 25/Jan 26", u("/assets/a/1-1%20R19%20TT-JNTUGV.pdf")],
    ["2025", "MCA II Sem Revolution Result is declared", "https://exams.jntugv.edu.in/results"],
    ["2025", "JNTUGV-Revaluation Results of I B Tech I Semester Supplementary & II Semester Supplementary Examinations-R23/R20/R19/R16 Regulations held in July 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "JNTUGV MCA II SEM JULY 2025 RESULT - R20 Regulation", "https://exams.jntugv.edu.in/results"],
    ["2025", "MBA IV sem - May 25 Revaluation result is declared", "https://exams.jntugv.edu.in/results"],
    ["2025", "Revaluation results of the II B.Tech I Semester (R23/R20/R19/R16) Supplementary Examinations conducted in May 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "III B.Tech II Semester (R20/R19/R16 regulations) Regular/Supplementary Examinations held in April/May 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "MCA IV Semester Regular/Supplementary Examinations held in MARCH 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "JNTUGV IB Tech I Semester Supplementary Examinations-R23/R20/R19/R16 Regulations held in june 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "II B.Tech II Semester (R20/R19/R16 regulations) Regular/Supplementary Examinations held in April/May 2025 RESULT LINK", "https://exams.jntugv.edu.in/results"],
    ["2025", "Revaluation results for the II B.Tech II Semester (R23/R20/R19/R16) Regular/Supplementary Examinations conducted in April 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "Result for MBA IV sem Examinations of may 2025 declared . the last date for apply revaluation is 25/7/2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "Result for I B.Tech II SEM SUPPLY Examinations(R23,R20,R19R16)-JNTUGV of June 2025 declared . The last date for apply revaluation is 25/7/2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "Result for MCA IV sem may 2025 declared . the last date for apply revaluation is 16/7/2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "II B.Tech I Semester (R23/R20/R19/R16) Supplementary Examinations Held in MAY 2025 - Apply for Revaluation on or before July 09, 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "III B.Tech I Semester (R20/R19/R16) Supplementary Examinations Held in April/May 2025 - Last Date to apply for Revaluation is : on or before July 03, 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "III B.Tech II Semester (R20/R19/R16 regulations) Regular/Supplementary Examinations April/May 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "II B.TECH 2ND SEM Regular & Supply Examinations April 2025 (R23 , R19) results", "https://exams.jntugv.edu.in/results"],
    ["2025", "III B.Tech. II Sem Supply Revaluation Results Jan 2025", "https://exams.jntugv.edu.in/results"],
    ["2025", "II B.Tech I Sem Regular & Supply Revaluation Results Declared, Nov/Dec 2024", "https://exams.jntugv.edu.in/results"],
  ],

  /* ---------- Academic Notifications ---------- */
  notifications: [
    ["2026 - 2027", "JNTUGV 3-1 B.Tech Supply Notification Nov-2026", u("/assets/pdf/oct/JNTUGV%203-1%20B.Tech%20Supply%20Notification%20Nov-2026.pdf")],
    ["2026 - 2027", "JNTUGV 4-1 BTECH NOTIFICATION -IV BTECH I SEM REG AND SUPPLY EXAMS NOVEMBER 2026", u("/assets/pdf/oct/JNTUGV%204-1%20BTECH%20NOTIFICATION%20-IV%20BTECH%20I%20SEM%20REG%20AND%20SUPPLY%20EXAMS%20NOVEMBER%202026.pdf")],
    ["2026 - 2027", "JNTUGV 4-2 BTECH NOTIFICATION -IV BTECH II SEM SUPPLY EXAMS NOVEMBER 2026", u("/assets/pdf/oct/JNTUGV%204-2%20BTECH%20NOTIFICATION%20-IV%20BTECH%20II%20SEM%20SUPPLY%20EXAMS%20NOVEMBER%202026.pdf")],
    ["2026 - 2027", "JNTUGV- 2-1 B.Tech Supply Notification Nov-2026", u("/assets/pdf/oct/JNTUGV-%202-1%20B.Tech%20Supply%20Notification%20Nov-2026.pdf")],
    ["2026 - 2027", "JNTUGV-2-2 B.Tech Supply Notification Nov-2026", u("/assets/pdf/oct/JNTUGV-2-2%20B.Tech%20Supply%20Notification%20Nov-2026.pdf")],
    ["2026 - 2027", "JNTUGV-3-2 B.Tech Supply Notification Nov-2026.pdf", u("/assets/pdf/oct/JNTUGV-3-2%20B.Tech%20Supply%20Notification%20Nov-2026.pdf")],
    ["", "M.TECH 2ND SEM SUPPLY R19 TIME-TABLE", u("/assets/pdf/M.TECH%202ND%20SEM%20SUPPLY%20R19%20TIME-TABLE.pdf")],
    ["2025 - 2026", "JNTUK Special Supply UG_OR, NR & RR, R05, R07,R10 Batches Notification-June-2026", u("/assets/pdf/JNTUK%20SPECIAL%20SUPPLY%20UG_OR,%20NR%20&%20RR,%20R05,%20R07,R10%20%20Batches%20Notification-June-2026.pdf")],
    ["2025 - 2026", "JNTUK Special Supply PG_2021 and prior Batches Notification-June-2026", u("/assets/pdf/JNTUK%20SPECAIL%20SUPPLY%20PG_2021%20and%20prior%20Batches%20Notification-June-2026.pdf")],
    ["2025 - 2026", "M.Tech - I Sem Regular & Supplementary Examination R24 Regulation", u("/assets/pdf/M.Tech%20-%20I%20Sem%20Regular%20&%20Supplementary%20Examination%20R24%20Regulati.pdf")],
    ["2025 - 2026", "Diploma Exams Notification for Mar-April - 2026", u("/assets/pdf/2.%20Diploma%20exams%20Notification%20for%20Mar-April'2026.pdf")],
    ["2025 - 2026", "Notification - JNTUGV-UES-IV B.Tech I SEM Advanced Supply Exams - FEB - 2026", u("/assets/a/NOTIFICATION-JNTUGV-UES-IV%20BTECH%20I%20SEM%20ADVANCED%20SUPPLE%20EXAMS-FEB-2026.pdf")],
    ["2025 - 2026", "RV RC OCT NOV 2025", u("/assets/pdf/RV%20RC%20OCT%20NOV%202025.pdf")],
    ["2025 - 2026", "I B Tech II Supply Exam Notification", u("/assets/a/693.jpeg")],
    ["2025 - 2026", "I B Tech II Sem Notification", u("/assets/a/I%20B%20Tech%20II%20Sem%20Notification.pdf")],
    ["2025 - 2026", "I B Tech I Sem Notification", u("/assets/a/I%20B%20Tech%20I%20Sem%20Notification.pdf")],
    ["2025 - 2026", "II, III, IV B TECH - SEM Notifications", u("/assets/a/AIETM%20-%20COMMENCEMENT%20OF%20CLASS%20WORK%20-%20NOV%202025%20(1).pdf")],
    ["2025 - 2026", "II B TECH - I Sem Regular Examination Notification", u("/assets/pdf/DocScanner%20Oct%208,%202025%2012-22%20PM.pdf")],
    ["2025 - 2026", "I M.TECH - II Sem Revolution Notification", u("/assets/pdf/DocScanner%20Oct%208,%202025%2012-06%20PM.pdf")],
    ["2025 - 2026", "I MBA/MCA - II Sem Revolution Notification", u("/assets/pdf/DocScanner%20Oct%208,%202025%2012-10%20PM.pdf")],
    ["2025 - 2026", "Diploma exams Oct-Nov 25 Notification Revised", u("/assets/pdf/Diploma-exams-Oct-Nov-25-Notification-Revised.pdf")],
    ["2025 - 2026", "IV B TECH I SEM R-16,19,20 REG & SUPPLY, OCT 2025", u("/assets/pdf/IV%20B%20TECH%20I%20SEM%20REG%20&%20SUPPLY,%20OCT%202025.pdf")],
    ["2025 - 2026", "III B.Tech I Reg_Supply R-16,19,20,23 Examinitions Notification, NOV 2025", u("/assets/pdf/B.Tech%20III-I%20Reg_Supply%20Examinitions%20%20Notification_NOVMBER%202025%20(8)%20(1).pdf")],
    ["2025 - 2026", "Diploma exams- Oct-Nov 25 Notification", u("/assets/pdf/Diploma%20exams-%20Oct-Nov%2025%20Notification.pdf")],
    ["2024 - 2025", "Last date to apply for revaluation / recounting for I BTech – 1 sem (supply) JNTU_GV is 6th August 2025. Interseted can submit their applications along with prescribed fee in the college office", u("/#")],
    ["2024 - 2025", "STATE BOARD OF TECHNICAL EDUCATION AND TRAINING ANDHRA PRADESH::MANGALAGIRI", u("/assets/pdf/exams/INSTANT%20PCRCRV%202025%20NOTIFICATION%202.pdf")],
    ["2024 - 2025", "IV B.TECH II Sem Adv Supple July 2025", u("/assets/pdf/exams/Notification-4-2%20B.Tech%20Adv%20Supple%20July%202025.pdf")],
    ["2024 - 2025", "JNTUGV - Examinations Postponed Circular 11.06.2025", u("/assets/pdf/exams/RV-RC-PC%20NOTOFICATION-1-2.pdf")],
    ["2024 - 2025", "II B.Tech I Sem Supply_April_ 2025", u("/assets/pdf/exams/II%20B.Tech%20I%20Sem%20Supply_April_%202025.pdf")],
    ["2024 - 2025", "III B.TECH I Sem .TechSuplimentary Notification April2025", u("/assets/pdf/exams/31B.TechSuplimentary%20Notification%20April2025.pdf")],
    ["2024 - 2025", "III B.TECH I Sem .TechSuplimentary Notification April2025", u("/assets/pdf/exams/31B.TechSuplimentary%20Notification%20April2025.pdf")],
    ["2024 - 2025", "III B.TECH - II R20 Time table-April-2025", u("/assets/pdf/exams/3-2%20R20%20Time%20table-April-2025.pdf")],
  ],

  /* ---------- Exam Time Tables ---------- */
  timetables: [
    ["JNTUGV I B Tech II Sem R19 Supply Time Table June 2026", u("/assets/pdf/JNTUGV%20%20I%20B%20Tech%20II%20Sem%20R19%20Supply%20Time%20Table%20June%202026.pdf")],
    ["JNTUGV I B Tech I Sem R16 Supply Time Table June 2026", u("/assets/pdf/JNTUGV%20I%20B%20Tech%20I%20Sem%20R16%20Supply%20Time%20Table%20June%202026.pdf")],
    ["JNTUGV I B Tech I Sem R19 Supply Time Table June 2026", u("/assets/pdf/JNTUGV%20I%20B%20Tech%20I%20Sem%20R19%20Supply%20Time%20Table%20June%202026.pdf")],
    ["JNTUGV I B Tech II Sem R20 Supply Time Table June 2026", u("/assets/pdf/JNTUGV%20I%20B%20Tech%20II%20Sem%20R20%20Supply%20Time%20Table%20June%202026.pdf")],
    ["JNTUGV I B Tech I Sem R20 Supply Time Table June 2026", u("/assets/pdf/JNTUGV%20%20I%20B%20Tech%20I%20Sem%20R20%20Supply%20Time%20Table%20June%202026.pdf")],
    ["JNTUGV I B Tech II Sem R16 Supply Time Table June 2026", u("/assets/pdf/JNTUGV%20%20I%20B%20Tech%20II%20Sem%20R16%20Supply%20Time%20Table%20June%202026.pdf")],
    ["MBA II SEMESTER R19 Supplementary Timetable", u("/assets/pdf/MBA%20II%20SEMESTER%20R19%20Supplementary%20Timetable.pdf")],
    ["MCA II SEMESTER R20 Supplementary Timetable", u("/assets/pdf/MCA%20II%20SEMESTER%20R20%20Supplementary%20Timetable.pdf")],
    ["IV BTECH II SEM R19 SUPPLE EXAM Time Table-MARCH 2026", u("/assets/pdf/IV%20BTECH%20II%20SEM%20R19%20SUPPLE%20%20EXAM%20Time%20Table-MARCH%202026.pdf")],
    ["IV BTECH I SEM R16 SUPPLE EXAM Time Table-MARCH 2026", u("/assets/pdf/IV%20BTECH%20I%20SEM%20R16%20SUPPLE%20%20EXAM%20Time%20Table-MARCH%202026.pdf")],
    ["M.Tech - I Semester ( R24 Regulation ) Regular & Supply Examination", u("/assets/pdf/M.Tech%20-%20I%20Semester%20(%20R24%20Regulation%20)%20Regular%20&%20Supply%20Examina.pdf")],
    ["M.TECH I SEMESTER (R24 REGULATION) MID-I EXAMINATIONS, FEBRUARY–2026", u("/assets/pdf/ddd.pdf")],
    ["TIME TABLE-IV B. TECH – I SEMESTER (R20) ADVANCED SUPPLEMENTARY EXAMINATIONS, FEBRUARY - 2026", u("/assets/pdf/TIME%20TABLE-IV%20B.%20TECH%20%E2%80%93%20I%20SEMESTER%20(R20)%20ADVANCED%20SUPPLEMENTARY%20EXAMINATIONS,%20FEBRUARY%20-%202026.pdf")],
    ["MBA I SEM R 24 MID 2 TIME TABLE DEC 2025", u("/assets/pdf/DocScanner%20Dec%202,%202025%2012-32%20PM.pdf")],
    ["MCA I SEM R 24 MID 2 TIME TABLE DEC 2025", u("/assets/pdf/DocScanner%20Dec%202,%202025%2012-26%20PM.pdf")],
    ["II B.tech I SEM ( R-24) Lab External Examinations, Nov 2024", u("/assets/pdf/DocScanner%20Nov%2012,%202025%2011-21%20AM.pdf")],
    ["I B.tech II SEM ( R-24) Supply Examinations, Nov 2024", u("/assets/pdf/DocScanner%20Nov%2012,%202025%2011-23%20AM.pdf")],
    ["TIME TABLE_3-2 SUPPLY R20 Examinations Nov2025", u("/assets/pdf/TIME%20TABLE_3-2%20SUPPLY%20%20R20%20Examinations%20Nov2025.pdf")],
    ["TIME TABLE_3-2 SUPPLY R16 Examinations Nov2025", u("/assets/pdf/TIME%20TABLE_3-2%20SUPPLY%20%20R16%20Examinations%20Nov2025.pdf")],
    ["TIME TABLE_3-2 SUPPLY R19 Examinations Nov2025", u("/assets/pdf/TIME%20TABLE_3-2%20SUPPLY%20%20R19%20Examinations%20Nov2025.pdf")],
    ["Time Table of IV B.Tech I sem (R20) Regular and supplementary exams October 2025", u("/assets/a1/Time%20Table%20of%20IV%20B.Tech%20I%20sem%20(R20)%20Regular%20and%20%20supplementary%20exams%20October%202025.pdf")],
    ["TIME TABLE OF IV B. TECH – II SEMESTER (R19) SUPPLEMENTARY EXAMINATIONS, OCTOBER - 2025", u("/assets/a1/TIME%20TABLE%20OF%20IV%20B.%20TECH%20%E2%80%93%20II%20SEMESTER%20(R19)%20SUPPLEMENTARY%20EXAMINATIONS,%20OCTOBER%20-%202025.pdf")],
    ["TIME TABLE IV B. TECH – I SEMESTER (R19) SUPPLEMENTARY EXAMINATIONS, OCT_NOV - 2025", u("/assets/a1/TIME%20TABLE%20IV%20B.%20TECH%20%E2%80%93%20I%20SEMESTER%20(R19)%20SUPPLEMENTARY%20EXAMINATIONS,%20OCT_NOV%20-%202025.pdf")],
    ["TIME TABLE OF IV B. TECH – II SEMESTER (R16) SUPPLEMENTARY EXAMINATIONS, OCTOBER - 2025", u("/assets/a1/TIME%20TABLE%20OF%20IV%20B.%20TECH%20%E2%80%93%20II%20SEMESTER%20(R16)%20SUPPLEMENTARY%20EXAMINATIONS,%20OCTOBER%20-%202025.pdf")],
    ["3-1 R23 REG_SUPPLY TIME TABLE_Nov2025", u("/assets/a1/3-1%20R23%20REG_SUPPLY%20TIME%20TABLE_Nov2025%20.pdf")],
    ["3-1 R16 REG_SUPPLY TIME TABLE Nov2025", u("/assets/a1/3-1%20R16%20REG_SUPPLY%20TIME%20TABLE%20Nov2025%20.pdf")],
    ["3-1 R20 REG_SUPPLIMETARY TIME TABLE Nov-2025", u("/assets/a1/3-1%20R20%20REG_SUPPLIMETARY%20TIME%20TABLE%20Nov-2025%20.pdf")],
    ["Diploma C-16 TIme Tables for OCT-NOV'2025.pdf", u("/assets/a/C-16%20TIme%20Tables%20for%20OCT-NOV'2025.pdf")],
    ["IV B.TECH I SEM (R20) REGULAR & SUPPLEMENTARY EXAMINATIONS TIME TABLE – OCTOBER/NOVEMBER 2025", u("/assets/a/Time%20Table%20of%20IV%20B.Tech%20I%20sem%20(R20)%20Regular%20and%20%20supplementary%20exams%20October%202025.pdf")],
    ["IV B. TECH – I SEMESTER (R19) SUPPLEMENTARY EXAMINATIONS TIME TABLE, OCT_NOV - 2025", u("/assets/a/TIME%20TABLE%20IV%20B.%20TECH%20%E2%80%93%20I%20SEMESTER%20(R19)%20SUPPLEMENTARY%20EXAMINATIONS,%20OCT_NOV%20-%202025.pdf")],
    ["IV B. TECH – I SEMESTER (R16) SUPPLEMENTARY EXAMINATIONS TIME TABLE, OCT_NOV - 2025", u("/assets/a/TIME%20TABLE%20IV%20B.%20TECH%20%E2%80%93%20I%20SEMESTER%20(R16)%20SUPPLEMENTARY%20EXAMINATIONS,%20OCT_NOV%20-%202025.pdf")],
    ["M.TECH 2ND SEM SUPPLY TIME TABLE, JUNE - 2025", u("/assets/pdf/exams/M.TECH%202ND%20SEM%20SUPPLY%20TIME%20TABLE.pdf")],
    ["I B.TECH - II SEMESTER (R23) SUPPLEMENTARY EXAMINATIONS TIME TABLE,JUNE-2025", u("/assets/pdf/exams/I%20B.TECH%20-%20II%20SEMESTER%20(R23)%20%20SUPPLEMENTARY%20EXAMINATIONS%20TIME%20TABLE,JUNE-2025-merged-5-6.pdf")],
    ["I B.TECH - II SEMESTER (R19) SUPPLEMENTARY EXAMINATIONS TIME TABLE,JUNE-2025", u("/assets/pdf/exams/I%20B.TECH%20-%20II%20SEMESTER%20(R19)%20%20SUPPLEMENTARY%20EXAMINATIONS%20TIME%20TABLE,JUNE-2025-merged-2.pdf")],
    ["RI B.TECH -I SEMESTER (R20) SUPPLEMENTARY EXAMINATIONS TIME TABLE,JUNE-2025", u("/assets/pdf/exams/I%20B.TECH%20-I%20SEMESTER%20(R20)%20SUPPLEMENTARY%20EXAMINATIONS%20TIME%20TABLE,JUNE-2025-merged-3-4.pdf")],
    ["I B.TECH -I SEMESTER (R23) SUPPLEMENTARY EXAMINATIONS TIME TABLE,JUNE-2025", u("/assets/pdf/exams/I%20B.TECH%20-I%20SEMESTER%20(R23)%20SUPPLEMENTARY%20EXAMINATIONS%20TIME%20TABLE,JUNE-2025-merged-5-6.pdf")],
    ["I B.TECH - II SEMESTER (R16) SUPPLEMENTARY EXAMINATIONS TIME TABLE,JUNE-2025", u("/assets/pdf/exams/I%20B.TECH%20-%20II%20SEMESTER%20(R16)%20%20SUPPLEMENTARY%20EXAMINATIONS%20TIME%20TABLE,JUNE-2025-merged-1.pdf")],
    ["I B.TECH -I SEMESTER (R19) SUPPLEMENTARY EXAMINATIONS TIME TABLE,JUNE-2025", u("/assets/pdf/exams/I%20B.TECH%20-I%20SEMESTER%20(R19)%20SUPPLEMENTARY%20EXAMINATIONS%20TIME%20TABLE,JUNE-2025-merged-2.pdf")],
    ["I B.TECH - II SEMESTER (R20) SUPPLEMENTARY EXAMINATIONS TIME TABLE,JUNE-2025", u("/assets/pdf/exams/I%20B.TECH%20-%20II%20SEMESTER%20(R20)%20%20SUPPLEMENTARY%20EXAMINATIONS%20TIME%20TABLE,JUNE-2025-merged-3-4.pdf")],
  ],

  vision: "To develop highly skilled professionals with ethics and human values",
  mission: [
    "To produce competent and highly motivated Engineers and Management professionals.",
    "To impart quality education with industrial exposure and professional training.",
    "To instill self confidence among students which is an imperative pre requisite to face the challenges of life.",
    "To exhort the spirit of professional beyond academic excellence.",
  ],
  objectives: [
    "To promote an integral and holistic growth of young and inquiring minds.",
    "To strengthen their confidence and competence to capably handle the emerging trends of their related fields.",
  ],

  features: [
    "24 hours Internet Facility", "Well Equipped Labs", "Sports & Recreational facilities",
    "Separate Hostels for both Boys & Girls within the campus", "Study Hours facilities for Hostellers",
    "Transport facility free for staff", "Modern Infrastructure facilities", "Experienced and Dedicated faculty",
    "Placement Assistance", "Excellent Results", "Advanced Teaching Methods", "Industrial Exposure",
    "Hygenic Canteen", "Gyamnasium", "Students Activity Centre", "CRT & Communication Classes",
    "NSS", "Sports", "Seminars & Symposia",
  ],

  courses: [
    { group: "Regular - B.Tech, M.Tech & P.G.", rows: [
      ["B.Tech", "ECE, EEE, CSE, CSE(AI & ML), CSE(DS), MECH"],
      ["M.Tech", "PE, VLSI, CSE, PS, DECS"],
      ["P.G.", "MCA, MBA & M.Tech."],
    ]},
    { group: "2nd Shift - Polytechnic", rows: [
      ["Polytechnic", "DME, DEEE, DECE, DCME"],
    ]},
  ],

  cultural: [
    [u("/assets/a/a3/1.jpeg"), "Annual Appreciation Award from Indian Red Cross Society"],
    [u("/assets/images/page26/1.jpeg"), "A two-day National Technical Meet Synergy 2026"],
    [u("/assets/images/page25/1.jpeg"), "A Pre-Pongal Events @2026"],
    [u("/assets/images/page23/2.jpeg"), "Induction meet@2025"],
    [u("/assets/images/page22/1.jpeg"), "10th NATIONAL AYURVEDA DAY - AYURVEDA AWARNESS PROGRAM @2025"],
    [u("/assets/b/1.jpeg"), "Anti Ragging Awareness Program@ addressed by DIG at Starhomes Narsipatnam"],
    [u("/assets/images/page20/1.jpeg"), "Engineering Day @2025"],
  ],

  events: [
    [u("/assets/images/page333/WhatsApp%20Image%202026-09-30%20at%209.52.20%20PM.jpeg"), "Freshers Day@2026", u("/page33")],
    [u("/assets/images/page35/1.jpeg"), "Induction Meet", u("/induction_meet1")],
    [u("/assets/images/page34/1.jpeg"), "Diplomo Fresher party", u("/di_frers_pty")],
    [u("/assets/images/page33/1.jpeg"), "Btech Induction Meet 2026", u("/btech_Intro_2026")],
    [u("/assets/images/page32/1.jpeg"), "Hackathon ignite 2026", u("/hackathon_2026")],
    [u("/assets/images/page31/1.jpeg"), "Diploma Induction meet", u("/Diploma_Induction_meet")],
    [u("/assets/images/page30/15.jpeg"), "5th July Alumni Meet Celebrations 2026", u("/alumni_meet")],
    [u("/assets/images/page29/2.jpeg"), "12th Yoga day celebrations", u("/yoga_day")],
    [u("/assets/images/page28/3.jpeg"), "Silver Jubliee (25th College Day) Celebrations & Inauguration of Silver Jubliee Block", u("/silver_jubliee")],
    [u("/assets/images/page27/1.jpeg"), "Anti Drug campaign and Road safety awareness program organised by Dept of Police, AP and SFI.", u("/anti_Drug_campaign")],
    [u("/assets/images/page26/1.jpeg"), "A two-day National Technical Meet Synergy 2026", u("/Technical_Meet")],
    [u("/assets/images/page25/1.jpeg"), "Celebrations of Pre-Pongal Events @2026", u("/prePongal_Events")],
    [u("/assets/a/popup1.jpeg"), "A two day Technical Expo Srujana-2k25", u("/Technical_Expo")],
    [u("/assets/images/page23/1.jpeg"), "Induction meet@2025", u("/Induction_meet")],
    [u("/assets/images/page22/1.jpeg"), "10th NATIONAL AYURVEDA DAY - AYURVEDA AWARNESS PROGRAM @2025", u("/AYURVEDA_DAY")],
    [u("/assets/b/1.jpeg"), "Anti Ragging Awareness Program@ addressed by DIG at Starhomes Narsipatnam", u("/Anti_Ragging")],
    [u("/assets/images/page20/1.jpeg"), "Engineering Day @2025 Celebrations", u("/engineering_day")],
    [u("/assets/a/a3/1.jpeg"), "Annual Appreciation Award from Indian Red Cross Society", u("/annual_appreciation")],
    [u("/assets/a1/1.jpeg"), "Teacher's Day Celebrations at Seminar Hall @2025", u("/teachers_day_2025")],
    [u("/assets/a/a2/1.jpeg"), "National sports day celebrations", u("/National_sports")],
    [u("/assets/a/a1/1.jpeg"), "Cyber crime, Drugs, Anti ragging and POCSO awareness held by District Police dept at AIET MAKAVARAPALEM Campus", u("/Cyber_crime")],
    [u("/assets/a/a1.jpeg"), "Btech 1st Year Induction meet Aug-2025", u("/btech_1st")],
    [u("/assets/a/1.jpeg"), "Yogandhra Event on Yoga Day 2025", u("/Yogandhra_Event")],
    [u("/assets/ncc/1.jpeg"), "NCC Annual Training camp, DS National Law University, Sabbavaram", u("/NCC_Annual_Training")],
    [u("/assets/about/b/WhatsApp%20Image%202025-06-06%20at%207.51.00%20AM.jpeg"), "NSS, NCC and RED CROSS TEAMS Conducted World Environment Day Awreness Programs", u("/NSS_NCC")],
    [u("/assets/about/b/WhatsApp%20Image%202025-05-03%20at%2010.27.33%20AM.jpeg"), "INDUSTRY CONNECT-2025", u("/Industry_connect2025")],
    [u("/assets/about/a/21.jpeg"), "Tech Vibe @ 25th Annual day celebrations", u("/Tech_Vibe")],
    [u("/assets/about/c2.jpg"), "MAHA SHIVARATRI, We Honor our NCC, NSS, and Red Cross Volunteers for their Dedication to Community Service", u("/assets/about/MAHA%20SHIVARATRI.jpg")],
    [u("/assets/about/dfs.jpg"), "Industry Connect", u("/industry_connect")],
    [u("/assets/events/IMG-20250312-WA0004.jpg"), "Traffic Awareness Program, Drug Abuse, Cyber Crime", u("/Traffic_Awareness")],
    [u("/assets/events/IMG-20250312-WA0012.jpg"), "International Women's Day Celebrations", u("/womens_day")],
    [u("/assets/events/IMG-20250312-WA0018.jpg"), "Awareness on Stress Management", u("/stress_management")],
    [u("/assets/events/1.jpeg"), "Synergy 2025", u("/synergy_2025")],
  ],

  info: [
    ["Grievance", "https://forms.gle/J7Sa9tUyxgmvaBfx9"],
    ["ECAP LOGIN (EMPLOYEE/STUDENT/PARENT)", "https://webprosindia.com/avanthinrpm"],
    ["Fee Online Payment", "https://easypay.axisbank.co.in/easyPay/makePayment?mid=NDY4ODY%3D"],
    ["BTECH – admissions – 2025 Category B (MQ) Application and instructions", u("/assets/pdf/AIETM-b-category-%20application%20form-2025.pdf")],
    ["AIETM-ADMISSIONS BROUCHURE - 2025 (03/07/2025)", u("/assets/pdf/AIETM-ADMISSIONS%20BROUCHURE%20-%202025.pdf")],
  ],
};
