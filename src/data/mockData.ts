import { 
  User, Course, Assessment, LearningResource, 
  Certificate, Announcement, Feedback, TrainerCompetency, PlatformActivity, Enrollment 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-trainee-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@imd.gov.in',
    role: 'trainee',
    department: 'Numerical Weather Prediction (NWP)',
    designation: 'Scientific Assistant Gr-I',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-08-12',
    phone: '+91 98765 43210',
    bio: 'Meteorologist specialized in WRF-ARW convective modeling and regional ensemble prediction systems.',
    qualifications: ['M.Sc. Atmospheric Sciences (Univ. of Delhi)', 'PG Diploma in Geoinformatics'],
    skills: ['WRF Modeling', 'Python (xarray)', 'Radar Meteorology', 'Ensemble Forecasting']
  },
  {
    id: 'user-trainer-1',
    name: 'Dr. M. K. Venkataraman',
    email: 'mk.venkat@imd.gov.in',
    role: 'trainer',
    department: 'Satellite Meteorology Division',
    designation: 'Scientist-F & Lead Trainer',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2023-01-15',
    phone: '+91 94231 11223',
    bio: '24+ years at IMD and MoES leading INSAT-3D/3DR multispectral analysis, Dvorak tropical cyclone intensity evaluation, and WMO regional training programs.',
    qualifications: ['Ph.D. Physical Meteorology (IISc Bangalore)', 'WMO Certified Master Instructor'],
    skills: ['Satellite Meteorology', 'INSAT-3DR Payloads', 'Cyclone Tracking', 'Machine Learning in Weather']
  },
  {
    id: 'user-admin-1',
    name: 'Shri R. K. Saxena',
    email: 'rk.saxena@moes.gov.in',
    role: 'admin',
    department: 'Capacity Building & Human Resource Development',
    designation: 'Director (Training) & Nodal Officer',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2022-04-10',
    phone: '+91 98112 23344',
    bio: 'Overseeing institutional capacity enhancement, national meteorological training courses, and inter-agency MoES technical competencies.',
    qualifications: ['M.Tech Atmospheric Tech (IIT Delhi)', 'Senior Management Programme (IIM-A)'],
    skills: ['Training Administration', 'Curriculum Design', 'Public Sector Governance', 'HR Policy']
  },
  {
    id: 'user-trainee-2',
    name: 'Anil Kumar Verma',
    email: 'anil.verma@imd.gov.in',
    role: 'trainee',
    department: 'Regional Meteorological Centre (Kolkata)',
    designation: 'Meteorologist-II',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-09-01',
    phone: '+91 97654 32109',
    bio: 'Specializing in Bay of Bengal tropical storm tracking and Doppler Weather Radar surveillance.',
    qualifications: ['B.Tech Computer Science', 'IMD Advanced Met Course'],
    skills: ['DWR Radar Analysis', 'Nowcasting', 'Storm Surge Modeling']
  },
  {
    id: 'user-trainee-3',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@incois.gov.in',
    role: 'trainee',
    department: 'Ocean Observation & Forecasting (INCOIS)',
    designation: 'Project Scientist-B',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-03-28',
    phone: '+91 99887 76655',
    bio: 'Assisting in coastal multi-hazard early warning and coastal vulnerability indexing.',
    qualifications: ['M.Sc. Oceanography (Andhra University)'],
    skills: ['Ocean Wave Modeling', 'GIS/Remote Sensing', 'Python']
  },
  {
    id: 'user-trainee-4',
    name: 'Rajesh Mukherjee',
    email: 'rajesh.m@imd.gov.in',
    role: 'trainee',
    department: 'Agro-Meteorological Advisory Services',
    designation: 'Technical Officer',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-04-02',
    phone: '+91 98450 12345',
    bio: 'Working on district-level block agro-weather forecast dissemination to rural farmers.',
    qualifications: ['M.Sc. Agricultural Meteorology'],
    skills: ['Crop Modeling', 'Soil Moisture Sensors', 'Weather Data Dissemination']
  },
  {
    id: 'user-trainer-2',
    name: 'Dr. Arpita Dasgupta',
    email: 'arpita.dasgupta@tropmet.res.in',
    role: 'trainer',
    department: 'Indian Institute of Tropical Meteorology (IITM Pune)',
    designation: 'Scientist-E',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-02-18',
    phone: '+91 97234 56789',
    bio: 'Monsoon dynamics expert, climate change modeler (IITM-ESM), and climate projections specialist.',
    qualifications: ['Ph.D. Climate Dynamics (IIT Kharagpur)', 'Postdoc (IPSL Paris)'],
    skills: ['Climate Science', 'IPCC Scenarios', 'NetCDF Python', 'Earth System Models']
  },
  {
    id: 'user-trainee-5',
    name: 'Tariq Ahmed',
    email: 'tariq.ahmed@imd.gov.in',
    role: 'trainee',
    department: 'Hydrometeorology Division',
    designation: 'Scientific Officer',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-11-10',
    phone: '+91 98333 44556',
    bio: 'Flood forecasting and catchment rainfall estimation.',
    qualifications: ['B.E. Civil & Water Resources'],
    skills: ['HEC-RAS', 'Rainfall Runoff', 'GIS']
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Advanced Numerical Weather Prediction (NWP) Modeling',
    code: 'MOES-NWP-401',
    category: 'Meteorology',
    trainerId: 'user-trainer-1',
    trainerName: 'Dr. M. K. Venkataraman',
    duration: '6 Weeks (42 Hours)',
    difficulty: 'Advanced',
    description: 'Comprehensive operational training on atmospheric equations, initial value problems, data assimilation (3D-Var / 4D-Var), parameterized physics, WRF and Global Forecast System (GFS) operational setups.',
    learningObjectives: [
      'Understand primitive atmospheric dynamical equations and numerical discretization schemes',
      'Configure and execute WRF-ARW runs with domain nesting and customized topography',
      'Integrate Doppler Radar and INSAT radiance data into GSI data assimilation suites',
      'Interpret quantitative precipitation forecasts (QPF) and calculate ensemble spread metrics'
    ],
    prerequisites: ['Basic Meteorology', 'Calculus & Partial Differential Equations', 'Linux CLI basics'],
    thumbnail: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    enrolledCount: 384,
    completionRate: 78,
    rating: 4.9,
    ratingCount: 142,
    createdAt: '2025-06-10',
    updatedAt: '2026-03-15',
    modules: [
      {
        id: 'mod-1-1',
        courseId: 'course-1',
        title: 'Module 1: Foundations of Atmospheric Dynamics & Grid Physics',
        order: 1,
        lessons: [
          {
            id: 'les-1-1-1',
            moduleId: 'mod-1-1',
            title: 'Governing Equations of Motion in Rotating Coordinates',
            durationMinutes: 45,
            type: 'video',
            contentSummary: 'Derivation of momentum, thermodynamic, continuity, and moisture conservation equations on spherical rotating earth.',
            pdfNotes: 'Atmospheric Dynamics Chapter 1 - MoES Training Monograph Vol 14.'
          },
          {
            id: 'les-1-1-2',
            moduleId: 'mod-1-1',
            title: 'Finite Difference Schemes and CFL Numerical Stability',
            durationMinutes: 35,
            type: 'reading',
            contentSummary: 'Courant-Friedrichs-Lewy stability criteria, leapfrog schemes, and numerical diffusion damping.',
            pdfNotes: 'Numerical Methods for Atmospheric Models (WMO Notes).'
          },
          {
            id: 'les-1-1-3',
            moduleId: 'mod-1-1',
            title: 'Grid Architecture: Arakawa Staggered Grids (A through E)',
            durationMinutes: 40,
            type: 'pdf',
            contentSummary: 'Comparing dispersion properties of gravity and inertia waves across Arakawa C-grid used in WRF vs B-grid in GFS.',
            pdfNotes: 'Technical Note on Coordinate Grids in IMD NWP Division.'
          }
        ]
      },
      {
        id: 'mod-1-2',
        courseId: 'course-1',
        title: 'Module 2: Data Assimilation & Observational Integration',
        order: 2,
        lessons: [
          {
            id: 'les-1-2-1',
            moduleId: 'mod-1-2',
            title: 'Background Error Covariance & 3D-Var Formulation',
            durationMinutes: 50,
            type: 'video',
            contentSummary: 'Formulation of cost functions, background error matrices (B-matrix), and observational error estimates.',
            pdfNotes: 'Data Assimilation in Operational Forecasting Guide.'
          },
          {
            id: 'les-1-2-2',
            moduleId: 'mod-1-2',
            title: 'Direct Assimilation of Satellite Radiance (INSAT-3DR Imager/Sounder)',
            durationMinutes: 55,
            type: 'video',
            contentSummary: 'Radiative transfer model (CRTM) interfacing, quality control, cloud clearing, and bias correction.',
            pdfNotes: 'Satellite Radiance Assimilation Handbook IMD 2025.'
          }
        ]
      },
      {
        id: 'mod-1-3',
        courseId: 'course-1',
        title: 'Module 3: Model Verification & Ensemble Forecast Systems',
        order: 3,
        lessons: [
          {
            id: 'les-1-3-1',
            moduleId: 'mod-1-3',
            title: 'Equitable Threat Score (ETS) & ROC Curve Evaluation',
            durationMinutes: 40,
            type: 'reading',
            contentSummary: 'Standard statistical verification metrics for precipitation and categorical warnings.',
            pdfNotes: 'WMO Standard Verification Manual.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Doppler Weather Radar (DWR) Operational Data Interpretation',
    code: 'MOES-DWR-302',
    category: 'Weather Forecasting',
    trainerId: 'user-trainer-1',
    trainerName: 'Dr. M. K. Venkataraman',
    duration: '4 Weeks (28 Hours)',
    difficulty: 'Intermediate',
    description: 'Hands-on operational radar meteorology covering S-Band, C-Band, and X-Band Doppler radars. Learn to identify supercells, mesocyclones, squall lines, microbursts, and anomalous propagation artifacts.',
    learningObjectives: [
      'Interpret Reflectivity (Z), Radial Velocity (V), and Spectrum Width (W) products',
      'Identify signatures of severe convective storms including Hook Echoes and BWER',
      'Utilize dual-polarization products (ZDR, CC, KDP) for hydrometeor classification',
      'Issue rapid nowcasting advisories with lead times of 1 to 3 hours'
    ],
    prerequisites: ['Radar Fundamentals', 'Synoptic Weather Analysis'],
    thumbnail: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    enrolledCount: 520,
    completionRate: 85,
    rating: 4.85,
    ratingCount: 215,
    createdAt: '2025-05-18',
    updatedAt: '2026-02-20',
    modules: [
      {
        id: 'mod-2-1',
        courseId: 'course-2',
        title: 'Module 1: Principles of Radar Meteorology & Base Products',
        order: 1,
        lessons: [
          {
            id: 'les-2-1-1',
            moduleId: 'mod-2-1',
            title: 'Radar Equation, Rayleigh Scattering & Volume Scanning Strategies',
            durationMinutes: 45,
            type: 'video',
            contentSummary: 'Atmospheric attenuation, beam refraction, 4/3 Earth radius model, and standard volume coverage patterns (VCP).',
            pdfNotes: 'IMD Radar Operational Guidelines - S-Band DWR Network.'
          },
          {
            id: 'les-2-1-2',
            moduleId: 'mod-2-1',
            title: 'Base Reflectivity (Z) and Velocity Dealiasing Algorithms',
            durationMinutes: 50,
            type: 'reading',
            contentSummary: 'Nyquist velocity limits, velocity folding, and automated phase unfolding.',
            pdfNotes: 'Doppler Dilemma & Unfolding Techniques Monograph.'
          }
        ]
      },
      {
        id: 'mod-2-2',
        courseId: 'course-2',
        title: 'Module 2: Severe Storm Signatures & Dual-Pol Classification',
        order: 2,
        lessons: [
          {
            id: 'les-2-2-1',
            moduleId: 'mod-2-2',
            title: 'Hook Echo, Mesocyclone Detection & BWER Signatures',
            durationMinutes: 60,
            type: 'video',
            contentSummary: 'Real case studies from Delhi, Kolkata, and Chennai DWR stations during severe pre-monsoon squalls (Kalbaishakhi).',
            pdfNotes: 'Case Study Atlas: Severe Thunderstorm Radar Signatures in India.'
          },
          {
            id: 'les-2-2-2',
            moduleId: 'mod-2-2',
            title: 'Dual-Polarization Hydrometeor Classification (HMC)',
            durationMinutes: 45,
            type: 'pdf',
            contentSummary: 'Differentiating hail, melting layer, heavy rain, and non-meteorological scatterers (insects, sea clutter).',
            pdfNotes: 'Polarimetric Radar Meteorology Manual.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Satellite Remote Sensing for Cyclone & Severe Storm Tracking',
    code: 'MOES-SAT-305',
    category: 'Satellite Meteorology',
    trainerId: 'user-trainer-1',
    trainerName: 'Dr. M. K. Venkataraman',
    duration: '5 Weeks (35 Hours)',
    difficulty: 'Advanced',
    description: 'Master INSAT-3D, 3DR, and 3DS multispectral imagery, thermal infrared cloud top brightness temperature analysis, and the Advanced Dvorak Technique (ADT) for tropical cyclone intensity estimation in the North Indian Ocean.',
    learningObjectives: [
      'Extract meteorological parameters from INSAT-3D/3DR TIR1, TIR2, and Water Vapor channels',
      'Execute the Dvorak Technique (T-number estimation) for Eye, Curved Band, and Shear patterns',
      'Analyze Scatterometer surface wind vectors for cyclone center fixing',
      'Formulate cyclone warning bulletins and cone of uncertainty graphics'
    ],
    prerequisites: ['Satellite Orbit Basics', 'Tropical Meteorology'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    enrolledCount: 462,
    completionRate: 82,
    rating: 4.95,
    ratingCount: 189,
    createdAt: '2025-07-22',
    updatedAt: '2026-03-30',
    modules: [
      {
        id: 'mod-3-1',
        courseId: 'course-3',
        title: 'Module 1: INSAT-3D/3DR Payloads & Multi-Spectral Imagery',
        order: 1,
        lessons: [
          {
            id: 'les-3-1-1',
            moduleId: 'mod-3-1',
            title: 'Geostationary vs Polar Orbiting Meteorological Satellites',
            durationMinutes: 40,
            type: 'video',
            contentSummary: 'Spatial, temporal, and radiometric resolution comparison between INSAT-3D, MetOp, and FY-4.',
            pdfNotes: 'Satellite Meteorology Lecture Notes - MoES Academy.'
          },
          {
            id: 'les-3-1-2',
            moduleId: 'mod-3-1',
            title: 'Thermal Infrared & Water Vapor Channel Interpretations',
            durationMinutes: 45,
            type: 'pdf',
            contentSummary: 'Atmospheric moisture transport, upper-tropospheric jet streams, and dry air intrusion identification.',
            pdfNotes: 'INSAT Interpretation Guide for Weather Forecasters.'
          }
        ]
      },
      {
        id: 'mod-3-2',
        courseId: 'course-3',
        title: 'Module 2: Dvorak Technique & Cyclone Center Identification',
        order: 2,
        lessons: [
          {
            id: 'les-3-2-1',
            moduleId: 'mod-3-2',
            title: 'Dvorak Pattern Types: Curved Band, Shear, CDO, and Eye Patterns',
            durationMinutes: 55,
            type: 'video',
            contentSummary: 'Step-by-step T-number determination, Central Cold Cover (CCC) rules, and maximum sustained wind estimation.',
            pdfNotes: 'WMO Tropical Cyclone Operational Plan (TCP-21).'
          }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Python for Atmospheric & Oceanic Data Science',
    code: 'MOES-PYT-201',
    category: 'Python for Scientific Computing',
    trainerId: 'user-trainer-2',
    trainerName: 'Dr. Arpita Dasgupta',
    duration: '4 Weeks (30 Hours)',
    difficulty: 'Intermediate',
    description: 'Learn modern Python tooling for atmospheric and climate datasets: handling multi-gigabyte NetCDF/GRIB files using xarray, parallel analysis with Dask, spatial plotting with Cartopy, and MetPy meteorological calculations.',
    learningObjectives: [
      'Load, slice, and aggregate ERA5, GFS, and IMD gridded datasets using xarray and cfgrib',
      'Generate publication-quality meteorological maps using Cartopy with terrain and shapefiles',
      'Calculate thermodynamic indices (CAPE, CIN, Lifted Index) and plot Skew-T diagrams with MetPy',
      'Optimize memory and execution using Dask chunking on multi-decadal climate grids'
    ],
    prerequisites: ['Basic Python Syntax', 'Fundamental Meteorology'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    enrolledCount: 610,
    completionRate: 91,
    rating: 4.92,
    ratingCount: 310,
    createdAt: '2025-04-14',
    updatedAt: '2026-03-01',
    modules: [
      {
        id: 'mod-4-1',
        courseId: 'course-4',
        title: 'Module 1: Gridded Meteorological Data Structures (NetCDF & GRIB2)',
        order: 1,
        lessons: [
          {
            id: 'les-4-1-1',
            moduleId: 'mod-4-1',
            title: 'NetCDF CF-Conventions, Dimensions, Coordinates & Variables in xarray',
            durationMinutes: 45,
            type: 'video',
            contentSummary: 'Working with multidimensional meteorological datasets (time, level, lat, lon).',
            pdfNotes: 'Python for Climate Science Lab Manual 2025.'
          },
          {
            id: 'les-4-1-2',
            moduleId: 'mod-4-1',
            title: 'Opening GRIB2 Operational Forecasts with eccodes & cfgrib',
            durationMinutes: 40,
            type: 'reading',
            contentSummary: 'Parsing GFS and NCUM output files, handling vertical coordinates and hybrid pressure levels.',
            pdfNotes: 'Operational GRIB2 Processing Recipes.'
          }
        ]
      },
      {
        id: 'mod-4-2',
        courseId: 'course-4',
        title: 'Module 2: Cartographic Visualization & Thermodynamic Calculations',
        order: 2,
        lessons: [
          {
            id: 'les-4-2-1',
            moduleId: 'mod-4-2',
            title: 'Cartopy Georeferenced Mapping & Indian Meteorological Subdivision Polygons',
            durationMinutes: 50,
            type: 'video',
            contentSummary: 'Plotting contourf geopotential height with wind barbs, India state boundaries, and IMD color scales.',
            pdfNotes: 'Cartopy Visualization Guide for Met Services.'
          },
          {
            id: 'les-4-2-2',
            moduleId: 'mod-4-2',
            title: 'Sounding Analysis: Skew-T Log-P Diagrams and Hodographs with MetPy',
            durationMinutes: 45,
            type: 'pdf',
            contentSummary: 'Automated radiosonde processing, Parcel path calculation, and convective parameter outputs.',
            pdfNotes: 'MetPy Practical Exercises.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Climate Change Projections and IPCC AR6 Framework for South Asia',
    code: 'MOES-CLM-405',
    category: 'Climate Science',
    trainerId: 'user-trainer-2',
    trainerName: 'Dr. Arpita Dasgupta',
    duration: '5 Weeks (32 Hours)',
    difficulty: 'Advanced',
    description: 'Detailed analysis of Shared Socioeconomic Pathways (SSPs), CMIP6 climate model projections, regional climate downscaling (CORDEX-South Asia), and monsoon variability in response to anthropogenic warming.',
    learningObjectives: [
      'Understand the CMIP6 model ensemble design and SSP scenario matrices',
      'Perform bias correction and spatial disaggregation on regional climate projections',
      'Analyze extreme precipitation and heatwave indices (ETCCDI metrics)',
      'Prepare climate risk assessment briefs for policy makers and district disaster authorities'
    ],
    prerequisites: ['Climatology', 'Statistical Methods'],
    thumbnail: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    enrolledCount: 320,
    completionRate: 74,
    rating: 4.88,
    ratingCount: 96,
    createdAt: '2025-08-05',
    updatedAt: '2026-02-14',
    modules: [
      {
        id: 'mod-5-1',
        courseId: 'course-5',
        title: 'Module 1: CMIP6 Architecture & South Asian Monsoon Climate Models',
        order: 1,
        lessons: [
          {
            id: 'les-5-1-1',
            moduleId: 'mod-5-1',
            title: 'IPCC AR6 Findings: Working Group I Physical Science Basis for India',
            durationMinutes: 50,
            type: 'video',
            contentSummary: 'Observed trends in temperatures, sea surface temperatures in Arabian Sea, and frequency of extreme rain events.',
            pdfNotes: 'MoES Assessment of Climate Change over the Indian Region.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-6',
    title: 'Disaster Risk Reduction and Multi-Hazard Early Warning Systems',
    code: 'MOES-DRR-204',
    category: 'Disaster Risk Reduction',
    trainerId: 'user-trainer-1',
    trainerName: 'Dr. M. K. Venkataraman',
    duration: '3 Weeks (21 Hours)',
    difficulty: 'Beginner',
    description: 'End-to-end framework of early warning dissemination, Common Alerting Protocol (CAP), impact-based forecasting (IBF), coastal flood inundation modeling, and disaster management coordination under Sendai Framework.',
    learningObjectives: [
      'Translate meteorological hazard thresholds into tangible socio-economic impact forecasts',
      'Implement Common Alerting Protocol (CAP) XML schemas for automated cell broadcast alerts',
      'Coordinate with NDMA, SDMAs, and local administrative bodies during cyclone evacuations',
      'Audit early warning chain effectiveness and last-mile dissemination reach'
    ],
    prerequisites: ['Basic Understanding of Natural Hazards'],
    thumbnail: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    enrolledCount: 440,
    completionRate: 88,
    rating: 4.79,
    ratingCount: 164,
    createdAt: '2025-09-12',
    updatedAt: '2026-01-25',
    modules: [
      {
        id: 'mod-6-1',
        courseId: 'course-6',
        title: 'Module 1: Impact-Based Forecasting & Warning Color Codes',
        order: 1,
        lessons: [
          {
            id: 'les-6-1-1',
            moduleId: 'mod-6-1',
            title: 'Green, Yellow, Orange, and Red Alert Criteria & Risk Matrix',
            durationMinutes: 35,
            type: 'video',
            contentSummary: 'Determining warning level through Matrix of Probability vs Severity of impact.',
            pdfNotes: 'IMD Standard Operating Procedure for Weather Warnings.'
          }
        ]
      }
    ]
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-1',
    userId: 'user-trainee-1',
    courseId: 'course-1',
    enrolledDate: '2025-09-10',
    progressPercentage: 66,
    completedLessonIds: ['les-1-1-1', 'les-1-1-2', 'les-1-1-3', 'les-1-2-1'],
    status: 'in-progress',
    lastAccessedAt: '2026-04-10T14:30:00Z'
  },
  {
    id: 'enr-2',
    userId: 'user-trainee-1',
    courseId: 'course-2',
    enrolledDate: '2025-08-20',
    progressPercentage: 100,
    completedLessonIds: ['les-2-1-1', 'les-2-1-2', 'les-2-2-1', 'les-2-2-2'],
    status: 'completed',
    lastAccessedAt: '2026-03-22T10:15:00Z',
    certificateId: 'cert-001'
  },
  {
    id: 'enr-3',
    userId: 'user-trainee-1',
    courseId: 'course-4',
    enrolledDate: '2025-10-01',
    progressPercentage: 50,
    completedLessonIds: ['les-4-1-1', 'les-4-1-2'],
    status: 'in-progress',
    lastAccessedAt: '2026-04-08T09:00:00Z'
  },
  {
    id: 'enr-4',
    userId: 'user-trainee-2',
    courseId: 'course-2',
    enrolledDate: '2025-09-15',
    progressPercentage: 100,
    completedLessonIds: ['les-2-1-1', 'les-2-1-2', 'les-2-2-1', 'les-2-2-2'],
    status: 'completed',
    lastAccessedAt: '2026-03-18T16:00:00Z',
    certificateId: 'cert-002'
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm-1',
    title: 'Doppler Weather Radar Operations & Reflectivity Interpretation',
    courseId: 'course-2',
    courseTitle: 'Doppler Weather Radar (DWR) Operational Data Interpretation',
    subject: 'Radar Meteorology',
    durationMinutes: 15,
    passingScorePercent: 70,
    totalQuestions: 6,
    deadline: '2026-05-15',
    createdBy: 'Dr. M. K. Venkataraman',
    status: 'active',
    questions: [
      {
        id: 'q-1-1',
        assessmentId: 'asm-1',
        questionText: 'Which radar reflectivity feature is recognized as a classic signature of a rotating supercell thunderstorm on a plan position indicator (PPI)?',
        topic: 'Severe Storm Signatures',
        options: [
          'Bow Echo with rear inflow notch',
          'Hook Echo wrapping around a BWER',
          'Bright Band melting layer ring',
          'Stratiform trailing line'
        ],
        correctOptionIndex: 1,
        explanation: 'A Hook Echo caused by hydrometeors wrapping around the mesocyclonic updraft is the classic indicator of supercell rotation and potential tornadic genesis.'
      },
      {
        id: 'q-1-2',
        assessmentId: 'asm-1',
        questionText: 'Under standard atmospheric refraction conditions, what effective Earth radius multiplier is applied to account for the downward curvature of the radar beam?',
        topic: 'Beam Propagation',
        options: [
          '4/3 Earth radius model',
          '1/2 Earth radius model',
          '2/1 Earth radius model',
          '5/4 Earth radius model'
        ],
        correctOptionIndex: 0,
        explanation: 'The 4/3 Earth radius model is conventionally used in radar meteorology to calculate beam height above the curved surface under standard vertical refractivity gradients.'
      },
      {
        id: 'q-1-3',
        assessmentId: 'asm-1',
        questionText: 'In dual-polarization radar observations, what combination of parameters is characteristic of large hail embedded in a heavy convective core?',
        topic: 'Dual-Pol Hydrometeor Classification',
        options: [
          'High Reflectivity (Z > 55 dBZ), Differential Reflectivity (ZDR) near 0 dB, and decreased Correlation Coefficient (CC < 0.95)',
          'Low Reflectivity (Z < 30 dBZ) and very high ZDR (> 4 dB)',
          'High Z (> 60 dBZ) with extremely high CC (0.99) and high ZDR (> 3.5 dB)',
          'Negative Reflectivity with zero spectrum width'
        ],
        correctOptionIndex: 0,
        explanation: 'Tumbling, non-spherical hailstones appear isotropic on average (yielding ZDR near 0 dB) despite enormous backscattered reflectivity (Z > 55 dBZ), with lower correlation (CC < 0.95) due to mixed shapes.'
      },
      {
        id: 'q-1-4',
        assessmentId: 'asm-1',
        questionText: 'What is the principal trade-off governed by the Doppler Dilemma in radar operation?',
        topic: 'Doppler Dilemma & PRF',
        options: [
          'Antenna diameter vs beam transmission frequency',
          'Maximum unambiguous range (R_max) vs maximum unambiguous velocity (V_max)',
          'Horizontal polarization power vs vertical polarization power',
          'Pulse duration vs transmitter vacuum cooling rate'
        ],
        correctOptionIndex: 1,
        explanation: 'The relationship R_max * V_max = (c * lambda) / 8 dictates that increasing maximum unambiguous range requires lowering the Pulse Repetition Frequency (PRF), which directly reduces the maximum unambiguous velocity.'
      },
      {
        id: 'q-1-5',
        assessmentId: 'asm-1',
        questionText: 'What causes the "Bright Band" phenomenon observed on radar vertical cross-sections (RHI) in stratiform rain regimes?',
        topic: 'Hydrometeor Physics',
        options: [
          'Ionization of ozone in the upper troposphere',
          'Aggregated snowflakes coated in liquid water melting just below the 0°C freezing level having higher dielectric permittivity than dry snow',
          'Lightning channel plasma reflection',
          'Thermal emission from supercooled liquid droplets'
        ],
        correctOptionIndex: 1,
        explanation: 'Melting snowflakes become water-coated while maintaining large snowflake dimensions; the dielectric factor of liquid water (|K|^2 ≈ 0.93) is ~5 times that of ice (|K|^2 ≈ 0.18), generating enhanced reflectivity.'
      },
      {
        id: 'q-1-6',
        assessmentId: 'asm-1',
        questionText: 'Which product is generated by taking the maximum reflectivity recorded across all elevation angles for each geographic grid coordinate?',
        topic: 'Operational Radar Products',
        options: [
          'Constant Altitude Plan Position Indicator (CAPPI)',
          'Composite Reflectivity (MAX-Z)',
          'Echo Tops (ET)',
          'Vertically Integrated Liquid (VIL)'
        ],
        correctOptionIndex: 1,
        explanation: 'Composite Reflectivity (MAX-Z) depicts the highest reflectivity value found along the vertical column across all elevation scans, providing an instantaneous view of storm intensity regardless of altitude.'
      }
    ]
  },
  {
    id: 'asm-2',
    title: 'Python for Meteorological Data Science & NetCDF',
    courseId: 'course-4',
    courseTitle: 'Python for Atmospheric & Oceanic Data Science',
    subject: 'Data Science & Python',
    durationMinutes: 12,
    passingScorePercent: 75,
    totalQuestions: 5,
    deadline: '2026-05-20',
    createdBy: 'Dr. Arpita Dasgupta',
    status: 'active',
    questions: [
      {
        id: 'q-2-1',
        assessmentId: 'asm-2',
        questionText: 'In the Python `xarray` package, which method provides index-based slicing by label/coordinate values rather than integer positions?',
        topic: 'xarray indexing',
        options: ['ds.iloc', 'ds.sel', 'ds.loc_idx', 'ds.filter_coord'],
        correctOptionIndex: 1,
        explanation: '`ds.sel()` allows selecting coordinates using coordinate labels (e.g. `lat=slice(8, 37)` or `time="2025-07-15"`), whereas `ds.isel()` uses integer index positions.'
      },
      {
        id: 'q-2-2',
        assessmentId: 'asm-2',
        questionText: 'Which Python library integrates seamlessly with Matplotlib to provide geodetic coordinate transformations and projection systems such as PlateCarree and LambertConformal?',
        topic: 'Geospatial Visualization',
        options: ['Basemap', 'Cartopy', 'Seaborn', 'NetworkX'],
        correctOptionIndex: 1,
        explanation: 'Cartopy is the modern standard Python library for cartographic projection and georeferenced plotting in atmospheric and earth sciences.'
      },
      {
        id: 'q-2-3',
        assessmentId: 'asm-2',
        questionText: 'When reading a 50GB multi-year climate dataset with `xarray.open_mfdataset()`, how can out-of-core parallel lazy evaluation be enabled?',
        topic: 'Big Data Processing',
        options: [
          'Pass `chunks={"time": 100}` or `chunks="auto"` to wrap arrays as Dask chunks',
          'Set `memory_limit=False` in open_mfdataset',
          'Install numpy-multithread and call ds.load_all()',
          'Convert the NetCDF file to CSV before processing'
        ],
        correctOptionIndex: 0,
        explanation: 'Supplying a `chunks` argument tells xarray to back the underlying array with Dask arrays, enabling lazy out-of-core evaluation without exhausting system RAM.'
      },
      {
        id: 'q-2-4',
        assessmentId: 'asm-2',
        questionText: 'Which thermodynamic parameter can be computed directly using MetPy from temperature, dewpoint, and pressure vertical profiles?',
        topic: 'MetPy Calculations',
        options: [
          'Convective Available Potential Energy (CAPE) and CIN',
          'Solar Photovoltaic output efficiency',
          'Ocean bottom salinity gradients',
          'Seismic P-wave velocity'
        ],
        correctOptionIndex: 0,
        explanation: '`metpy.calc.cape_cin()` evaluates parcel buoyancy curves and calculates CAPE and CIN directly from atmospheric soundings.'
      },
      {
        id: 'q-2-5',
        assessmentId: 'asm-2',
        questionText: 'Which binary file format engine is utilized by xarray when opening ECMWF / GFS operational forecast files with extension `.grib2`?',
        topic: 'GRIB2 File Standards',
        options: ['cfgrib (backed by ECMWF ecCodes)', 'h5py', 'scipy.io.netcdf', 'openpyxl'],
        correctOptionIndex: 0,
        explanation: 'The `cfgrib` engine interfaces with ECMWF ecCodes C-library to parse GRIB1 and GRIB2 meteorological messages into xarray Datasets.'
      }
    ]
  }
];

export const INITIAL_RESOURCES: LearningResource[] = [
  {
    id: 'res-1',
    title: 'MoES Operational NWP Model Configuration Handbook (2025 Edition)',
    type: 'pdf',
    subject: 'Meteorology',
    courseId: 'course-1',
    courseTitle: 'Advanced Numerical Weather Prediction (NWP) Modeling',
    trainerName: 'Dr. M. K. Venkataraman',
    uploadDate: '2026-02-10',
    fileSize: '14.2 MB',
    description: 'Detailed technical reference document specifying WRF-ARW namelist.input parameters, physics suites, and domain configurations for the Indian subcontinental domain.',
    downloadUrl: '/docs/MoES_NWP_Handbook_2025.pdf',
    viewCount: 842,
    isSimulated: true
  },
  {
    id: 'res-2',
    title: 'Recorded Masterclass: Dvorak Technique for Bay of Bengal Cyclones',
    type: 'lecture',
    subject: 'Satellite Meteorology',
    courseId: 'course-3',
    courseTitle: 'Satellite Remote Sensing for Cyclone & Severe Storm Tracking',
    trainerName: 'Dr. M. K. Venkataraman',
    uploadDate: '2026-03-04',
    fileSize: '480 MB (Stream)',
    description: '1 hour 25 minute lecture dissecting the step-by-step T-number progression of Very Severe Cyclonic Storms in the North Indian Ocean using INSAT-3DR thermal channels.',
    downloadUrl: '/lectures/Dvorak_Technique_Masterclass.mp4',
    viewCount: 1250,
    isSimulated: true
  },
  {
    id: 'res-3',
    title: 'Dual-Pol Radar Hydrometeor Classification Decision Matrix',
    type: 'presentation',
    subject: 'Weather Forecasting',
    courseId: 'course-2',
    courseTitle: 'Doppler Weather Radar (DWR) Operational Data Interpretation',
    trainerName: 'Dr. M. K. Venkataraman',
    uploadDate: '2026-01-18',
    fileSize: '8.7 MB',
    description: 'PowerPoint operational training slides with fuzzy logic decision trees for classifying hail, heavy rain, biological scatterers, and chaff.',
    downloadUrl: '/slides/Dual_Pol_Radar_Decision_Trees.pptx',
    viewCount: 630,
    isSimulated: true
  },
  {
    id: 'res-4',
    title: 'Python for Climate Science: xarray & Cartopy Jupyter Notebook Workbook',
    type: 'document',
    subject: 'Python for Scientific Computing',
    courseId: 'course-4',
    courseTitle: 'Python for Atmospheric & Oceanic Data Science',
    trainerName: 'Dr. Arpita Dasgupta',
    uploadDate: '2026-03-12',
    fileSize: '3.4 MB',
    description: 'Fully documented executable Jupyter Notebook with step-by-step recipes for ERA5 precipitation anomalies, wind vector plots, and IMD gridded daily rainfall interpolation.',
    downloadUrl: '/code/xarray_cartopy_climate_workbook.ipynb',
    viewCount: 1410,
    isSimulated: true
  },
  {
    id: 'res-5',
    title: 'Impact-Based Weather Forecasting Standard Operating Procedures (SOP)',
    type: 'pdf',
    subject: 'Disaster Risk Reduction',
    courseId: 'course-6',
    courseTitle: 'Disaster Risk Reduction and Multi-Hazard Early Warning Systems',
    trainerName: 'Dr. M. K. Venkataraman',
    uploadDate: '2025-11-20',
    fileSize: '5.9 MB',
    description: 'Official IMD protocol manual explaining warning matrices, color coding criteria (Green, Yellow, Orange, Red), and NDMA integration guidelines.',
    downloadUrl: '/docs/IMD_Impact_Based_Forecasting_SOP.pdf',
    viewCount: 970,
    isSimulated: true
  },
  {
    id: 'res-6',
    title: 'Questionnaire: Radar Meteorology Competency Self-Assessment',
    type: 'questionnaire',
    subject: 'Weather Forecasting',
    courseId: 'course-2',
    courseTitle: 'Doppler Weather Radar (DWR) Operational Data Interpretation',
    trainerName: 'Dr. M. K. Venkataraman',
    uploadDate: '2026-02-28',
    fileSize: '1.2 MB',
    description: '30-question diagnostic questionnaire with full answer rationale to assess operational readiness before shift deployment at Radar stations.',
    downloadUrl: '/tests/DWR_Competency_Questionnaire.pdf',
    viewCount: 420,
    isSimulated: true
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-001',
    certificateNumber: 'MOES-CC-2026-08492',
    userId: 'user-trainee-1',
    userName: 'Priya Sharma',
    userDesignation: 'Scientific Assistant Gr-I',
    department: 'Numerical Weather Prediction (NWP)',
    courseId: 'course-2',
    courseTitle: 'Doppler Weather Radar (DWR) Operational Data Interpretation',
    trainerName: 'Dr. M. K. Venkataraman',
    issueDate: '2026-03-22',
    grade: 'A+ (Distinction)',
    scorePercentage: 94,
    verificationCode: 'VRF-9821-MOES-IMD'
  },
  {
    id: 'cert-002',
    certificateNumber: 'MOES-CC-2026-07914',
    userId: 'user-trainee-2',
    userName: 'Anil Kumar Verma',
    userDesignation: 'Meteorologist-II',
    department: 'Regional Meteorological Centre (Kolkata)',
    courseId: 'course-2',
    courseTitle: 'Doppler Weather Radar (DWR) Operational Data Interpretation',
    trainerName: 'Dr. M. K. Venkataraman',
    issueDate: '2026-03-18',
    grade: 'A (High Honors)',
    scorePercentage: 88,
    verificationCode: 'VRF-7412-MOES-IMD'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Mandatory Pre-Monsoon 2026 Operational Radar Nowcasting Certification',
    category: 'Training Schedules',
    priority: 'Urgent',
    content: 'All meteorological scientific officers and assistants deployed across coastal and thunderstorm-prone Doppler Weather Radar stations must complete the DWR certification and refresher assessment before May 15, 2026.',
    publishDate: '2026-04-05',
    author: 'Shri R. K. Saxena',
    authorRole: 'Director (Training), IMD',
    readBy: ['user-trainee-1']
  },
  {
    id: 'ann-2',
    title: 'New Course Launch: High-Resolution Regional Earth System Modeling (IITM-ESM)',
    category: 'New Courses',
    priority: 'High',
    content: 'The Centre for Climate Change Research (CCCR) and IITM Pune have published a new advanced specialized training module on regional coupled climate modeling and ocean-atmosphere interface thermodynamics.',
    publishDate: '2026-04-01',
    author: 'Dr. Arpita Dasgupta',
    authorRole: 'Scientist-E, IITM Pune',
    readBy: []
  },
  {
    id: 'ann-3',
    title: 'Scheduled Maintenance: Capacity Connect Cloud Learning Repository',
    category: 'General Announcements',
    priority: 'Normal',
    content: 'The centralized video streaming and NetCDF high-performance compute sandbox will undergo maintenance on Saturday, 18 April 2026 from 02:00 IST to 06:00 IST. Course materials remain accessible offline.',
    publishDate: '2026-03-29',
    author: 'Platform Technical Admin',
    authorRole: 'IT Systems Division, MoES',
    readBy: ['user-trainee-1']
  },
  {
    id: 'ann-4',
    title: 'Deadline Approaching: Assessment 1 for Doppler Weather Radar Operations',
    category: 'Assessment Deadlines',
    priority: 'High',
    content: 'Trainees enrolled in batch 2026-A must finalize their timed MCQ assessment by 15 May 2026 to be eligible for certificate issuance and operational shift endorsements.',
    publishDate: '2026-03-25',
    author: 'Dr. M. K. Venkataraman',
    authorRole: 'Lead Trainer',
    readBy: []
  }
];

export const INITIAL_TRAINER_COMPETENCIES: TrainerCompetency[] = [
  {
    trainerId: 'user-trainer-1',
    trainerName: 'Dr. M. K. Venkataraman',
    email: 'mk.venkat@imd.gov.in',
    department: 'Satellite Meteorology Division',
    designation: 'Scientist-F & Lead Trainer',
    qualifications: ['Ph.D. Physical Meteorology (IISc Bangalore)', 'M.Sc. Physics (Madras University)', 'WMO Master Trainer'],
    experienceYears: 24,
    domains: ['Satellite Meteorology', 'Radar Meteorology', 'Weather Forecasting', 'Disaster Risk Reduction'],
    skills: ['INSAT-3DR Payloads', 'Dvorak Cyclone Evaluation', 'Doppler Radar ZDR/CC Interpretation', 'Impact Forecasting'],
    competencyLevels: [
      { domain: 'Satellite Meteorology', level: 'Expert', score: 98 },
      { domain: 'Weather Forecasting', level: 'Expert', score: 95 },
      { domain: 'Radar Meteorology', level: 'Expert', score: 92 },
      { domain: 'Disaster Risk Reduction', level: 'Advanced', score: 88 }
    ],
    certifications: ['WMO Senior Instructor Level-IV', 'UN-ESCAP Cyclone Advisory Expert', 'ISRO Satellite Data Utilization'],
    rating: 4.9,
    assignedCoursesCount: 4,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Pioneer of satellite-based cyclone intensity tracking in the Indian Ocean. Authored 45 peer-reviewed papers on geostationary sounder assimilation.'
  },
  {
    trainerId: 'user-trainer-2',
    trainerName: 'Dr. Arpita Dasgupta',
    email: 'arpita.dasgupta@tropmet.res.in',
    department: 'Indian Institute of Tropical Meteorology (IITM Pune)',
    designation: 'Scientist-E',
    qualifications: ['Ph.D. Climate Dynamics (IIT Kharagpur)', 'M.Tech Earth System Sciences', 'Postdoc (IPSL Paris)'],
    experienceYears: 16,
    domains: ['Climate Science', 'Python for Scientific Computing', 'Atmospheric Science', 'Environmental Monitoring'],
    skills: ['Python (xarray/Cartopy/MetPy)', 'CMIP6 Earth System Models', 'Monsoon Intra-Seasonal Oscillations', 'CORDEX Downscaling'],
    competencyLevels: [
      { domain: 'Climate Science', level: 'Expert', score: 96 },
      { domain: 'Python for Scientific Computing', level: 'Expert', score: 97 },
      { domain: 'Atmospheric Science', level: 'Expert', score: 91 },
      { domain: 'Environmental Monitoring', level: 'Advanced', score: 85 }
    ],
    certifications: ['IPCC Contributing Author AR6', 'WCRP Monsoon Panel Fellow', 'Python Scientific Software Foundation'],
    rating: 4.92,
    assignedCoursesCount: 3,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Specialist in high-resolution climate modeling and computational atmospheric tools. Mentored over 400 scientists across SAARC nations.'
  },
  {
    trainerId: 'trainer-3',
    trainerName: 'Dr. Suresh Babu K.',
    email: 'suresh.babu@moes.gov.in',
    department: 'National Centre for Medium Range Weather Forecasting (NCMRWF)',
    designation: 'Scientist-G & Head (Data Assimilation)',
    qualifications: ['Ph.D. Numerical Analysis (IIT Delhi)', 'M.Sc. Applied Mathematics'],
    experienceYears: 22,
    domains: ['Meteorology', 'Python for Scientific Computing', 'Atmospheric Science'],
    skills: ['Ensemble Kalman Filter', '4D-Var Assimilation', 'HPC Parallel Cluster Architecture', 'NCUM Operational Suite'],
    competencyLevels: [
      { domain: 'Meteorology', level: 'Expert', score: 97 },
      { domain: 'Atmospheric Science', level: 'Expert', score: 94 },
      { domain: 'Python for Scientific Computing', level: 'Advanced', score: 89 }
    ],
    certifications: ['ECMWF Advanced Data Assimilation', 'High Performance Computing Fellowship'],
    rating: 4.88,
    assignedCoursesCount: 2,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead architect of India’s Unified Model Operational Suite with 20+ years expertise in coupled NWP modeling.'
  },
  {
    trainerId: 'trainer-4',
    trainerName: 'Dr. Neha G. Kulkarni',
    email: 'neha.kulkarni@incois.gov.in',
    department: 'Indian National Centre for Ocean Information Services (INCOIS)',
    designation: 'Scientist-E (Ocean Dynamics)',
    qualifications: ['Ph.D. Physical Oceanography (Goa University)', 'M.Sc. Marine Geophysics'],
    experienceYears: 14,
    domains: ['Disaster Risk Reduction', 'Remote Sensing', 'Environmental Monitoring'],
    skills: ['Storm Surge ADCIRC Modeling', 'Tsunami Warning Decision Support', 'Satellite Altimetry', 'Coastal Inundation'],
    competencyLevels: [
      { domain: 'Disaster Risk Reduction', level: 'Expert', score: 94 },
      { domain: 'Remote Sensing', level: 'Advanced', score: 89 },
      { domain: 'Environmental Monitoring', level: 'Advanced', score: 87 }
    ],
    certifications: ['IOC-UNESCO Tsunami Master Trainer', 'GIS Coastal Vulnerability Lead'],
    rating: 4.84,
    assignedCoursesCount: 1,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Operational coastal multi-hazard warning lead with extensive field deployments along the Coromandel coast.'
  }
];

export const INITIAL_FEEDBACK: Feedback[] = [
  {
    id: 'fb-1',
    courseId: 'course-2',
    courseTitle: 'Doppler Weather Radar (DWR) Operational Data Interpretation',
    userId: 'user-trainee-1',
    userName: 'Priya Sharma',
    userRole: 'trainee',
    rating: 5,
    aspects: { contentQuality: 5, instructorDelivery: 5, practicalRelevance: 5 },
    comment: 'Exceptional hands-on clarity on dual-pol hydrometeor classification. The case studies on Kalbaishakhi squall lines directly aided our daily forecast shift duty.',
    submittedAt: '2026-03-24T11:20:00Z'
  },
  {
    id: 'fb-2',
    courseId: 'course-2',
    courseTitle: 'Doppler Weather Radar (DWR) Operational Data Interpretation',
    userId: 'user-trainee-2',
    userName: 'Anil Kumar Verma',
    userRole: 'trainee',
    rating: 5,
    aspects: { contentQuality: 5, instructorDelivery: 4, practicalRelevance: 5 },
    comment: 'The simulated radar scans and BWER identification modules are top notch. Very helpful for real-time nowcasting in eastern India.',
    submittedAt: '2026-03-20T15:40:00Z'
  },
  {
    id: 'fb-3',
    courseId: 'course-4',
    courseTitle: 'Python for Atmospheric & Oceanic Data Science',
    userId: 'user-trainee-1',
    userName: 'Priya Sharma',
    userRole: 'trainee',
    rating: 5,
    aspects: { contentQuality: 5, instructorDelivery: 5, practicalRelevance: 5 },
    comment: 'Finally a course built specifically for NetCDF and MetPy instead of generic data science tutorials! Highly recommended for all MoES scientists.',
    submittedAt: '2026-04-09T18:10:00Z'
  }
];

export const INITIAL_ACTIVITIES: PlatformActivity[] = [
  {
    id: 'act-1',
    type: 'completion',
    description: 'Priya Sharma completed Doppler Weather Radar (DWR) Operational Data Interpretation with Distinction (94%)',
    timestamp: '2 hours ago',
    user: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    meta: 'Grade: A+'
  },
  {
    id: 'act-2',
    type: 'enrollment',
    description: '38 new scientific officers enrolled in Advanced Numerical Weather Prediction (NWP) Modeling',
    timestamp: '5 hours ago',
    user: 'Batch 2026-B',
    meta: '38 Trainees'
  },
  {
    id: 'act-3',
    type: 'announcement',
    description: 'Urgent notice published: Mandatory Pre-Monsoon 2026 Operational Radar Nowcasting Certification',
    timestamp: '1 day ago',
    user: 'Shri R. K. Saxena',
    meta: 'Director (Training)'
  },
  {
    id: 'act-4',
    type: 'assessment',
    description: 'Anil Kumar Verma submitted Radar Meteorology Assessment with score 88%',
    timestamp: '2 days ago',
    user: 'Anil Kumar Verma',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    meta: 'Passed'
  },
  {
    id: 'act-5',
    type: 'course_created',
    description: 'Dr. Arpita Dasgupta updated Python for Atmospheric & Oceanic Data Science curriculum with Cartopy v0.24',
    timestamp: '3 days ago',
    user: 'Dr. Arpita Dasgupta',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    meta: 'v2.1 Update'
  }
];
