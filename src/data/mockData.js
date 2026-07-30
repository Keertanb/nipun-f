// ---------------------------------------------------------------------------
// Nipun Gujarat — static mock data
// Districts -> Blocks -> Clusters -> Schools -> Teachers -> Students
// ---------------------------------------------------------------------------

const firstNamesBoy = [
  'Aarav', 'Krish', 'Dhruv', 'Vihaan', 'Yash', 'Meet', 'Kabir', 'Arjun', 'Om',
  'Parth', 'Rudra', 'Kevin', 'Devansh', 'Harsh', 'Vivaan', 'Aryan', 'Nakul',
  'Shivansh', 'Raj', 'Karan', 'Vedant', 'Jay', 'Ansh', 'Yug', 'Reyansh',
]
const firstNamesGirl = [
  'Riya', 'Diya', 'Mahi', 'Kavya', 'Jiya', 'Anaya', 'Vidhi', 'Khushi', 'Aarohi',
  'Bhumi', 'Disha', 'Heer', 'Janvi', 'Kiara', 'Myra', 'Nidhi', 'Prisha', 'Saanvi',
  'Tanvi', 'Urvi', 'Vani', 'Zara', 'Ishani', 'Aditi', 'Palak',
]
const surnames = [
  'Patel', 'Shah', 'Parmar', 'Solanki', 'Joshi', 'Desai', 'Chaudhary', 'Rathod',
  'Vaghela', 'Thakor', 'Prajapati', 'Mehta', 'Gohil', 'Barot', 'Chauhan', 'Zala',
]

const districtData = [
  {
    name: 'Ahmedabad',
    blocks: [
      { name: 'Daskroi', clusters: ['Vatva Cluster', 'Bareja Cluster'] },
      { name: 'Sanand', clusters: ['Sanand Cluster', 'Kolat Cluster'] },
    ],
  },
  {
    name: 'Rajkot',
    blocks: [
      { name: 'Lodhika', clusters: ['Metoda Cluster', 'Kotharia Cluster'] },
      { name: 'Kotda Sangani', clusters: ['Sangani Cluster', 'Padadhri Cluster'] },
    ],
  },
  {
    name: 'Surat',
    blocks: [
      { name: 'Choryasi', clusters: ['Kamrej Cluster', 'Sarthana Cluster'] },
      { name: 'Olpad', clusters: ['Olpad Cluster', 'Kosad Cluster'] },
    ],
  },
  {
    name: 'Vadodara',
    blocks: [
      { name: 'Savli', clusters: ['Savli Cluster', 'Manjusar Cluster'] },
      { name: 'Waghodia', clusters: ['Waghodia Cluster', 'Ranoli Cluster'] },
    ],
  },
  {
    name: 'Bhavnagar',
    blocks: [
      { name: 'Ghogha', clusters: ['Ghogha Cluster', 'Khadsaliya Cluster'] },
      { name: 'Sihor', clusters: ['Sihor Cluster', 'Umrala Cluster'] },
    ],
  },
]

const schoolNameTemplates = [
  'Shree Prathmik Shala',
  'Government Primary School',
  'Shree Sarvajanik Prathmik Shala',
  'Kanya Prathmik Shala',
  'Shree Balvatika Prathmik Shala',
]

const villagesByDistrict = {
  Ahmedabad: ['Vatva', 'Bareja', 'Sanand', 'Kolat', 'Iyava', 'Chharodi'],
  Rajkot: ['Metoda', 'Kotharia', 'Sangani', 'Padadhri', 'Khirasara', 'Veraval'],
  Surat: ['Kamrej', 'Sarthana', 'Olpad', 'Kosad', 'Bharthana', 'Variav'],
  Vadodara: ['Savli', 'Manjusar', 'Waghodia', 'Ranoli', 'Undera', 'Sokhda'],
  Bhavnagar: ['Ghogha', 'Khadsaliya', 'Sihor', 'Umrala', 'Vartej', 'Songadh'],
}

// ---------------------------------------------------------------------------
// Build Schools (20 total, 4 per district)
// ---------------------------------------------------------------------------
let schoolCounter = 1
export const schools = []
districtData.forEach((district) => {
  const villages = villagesByDistrict[district.name]
  for (let i = 0; i < 4; i++) {
    const block = district.blocks[i % district.blocks.length]
    const cluster = block.clusters[i % block.clusters.length]
    const village = villages[i % villages.length]
    const template = schoolNameTemplates[i % schoolNameTemplates.length]
    const code = `GJ-${String(schoolCounter).padStart(4, '0')}`
    schools.push({
      id: `SCH${schoolCounter}`,
      code,
      name: `${template}, ${village}`,
      district: district.name,
      block: block.name,
      cluster,
      village,
    })
    schoolCounter++
  }
})

// ---------------------------------------------------------------------------
// Build Teachers (50 total, distributed across schools)
// ---------------------------------------------------------------------------
const teacherFirstNames = [
  'Mehul', 'Jignesh', 'Hetal', 'Bhavesh', 'Pooja', 'Ramesh', 'Nilesh', 'Falguni',
  'Kiran', 'Sunita', 'Ashok', 'Rekha', 'Dilip', 'Manisha', 'Vijay', 'Sarita',
  'Girish', 'Bharti', 'Alpesh', 'Jyoti', 'Sanjay', 'Kalpana', 'Naresh', 'Chetna',
  'Piyush', 'Rita', 'Mahendra', 'Neeta', 'Rakesh', 'Priya', 'Sunil', 'Dipika',
  'Ketan', 'Varsha', 'Amit', 'Meena', 'Yogesh', 'Nayana', 'Paresh', 'Trupti',
  'Bharat', 'Kokila', 'Vinod', 'Shobhna', 'Kamlesh', 'Anita', 'Harish', 'Usha',
  'Jayesh', 'Snehal',
]

export const teachers = []
for (let i = 0; i < 50; i++) {
  const school = schools[i % schools.length]
  const gender = i % 2 === 0 ? 'Male' : 'Female'
  const first = teacherFirstNames[i % teacherFirstNames.length]
  const last = surnames[(i * 3 + 1) % surnames.length]
  teachers.push({
    id: `TCH${1000 + i}`,
    teacherId: `T-${String(2400 + i)}`,
    name: `${first} ${last}`,
    gender,
    schoolId: school.id,
    schoolName: school.name,
    district: school.district,
    block: school.block,
    cluster: school.cluster,
    village: school.village,
    schoolCode: school.code,
    classesAssigned: ['Balvatika', 'Std 1', 'Std 2', 'Std 3', 'Std 4', 'Std 5'].slice(
      0,
      2 + (i % 5)
    ),
    avatarSeed: `${first}${last}${i}`,
  })
}

// Ensure the sample named teachers from the spec exist explicitly (front & center)
export const featuredTeacher = teachers[0]
teachers[0].name = 'Mehul Patel'
teachers[1].name = 'Jignesh Shah'
teachers[2].name = 'Hetal Patel'
teachers[3].name = 'Bhavesh Parmar'
teachers[4].name = 'Pooja Joshi'

// ---------------------------------------------------------------------------
// Build Students (300+, spread across classes for every teacher)
// ---------------------------------------------------------------------------
export const classList = ['Balvatika', 'Std 1', 'Std 2', 'Std 3', 'Std 4', 'Std 5']
const classAgeMap = {
  Balvatika: 5, 'Std 1': 6, 'Std 2': 7, 'Std 3': 8, 'Std 4': 9, 'Std 5': 10,
}

let studentCounter = 1
export const students = []

teachers.forEach((teacher, tIdx) => {
  teacher.classesAssigned.forEach((cls, cIdx) => {
    const countInClass = 5 + ((tIdx + cIdx) % 4) // 5-8 students per class per teacher
    for (let s = 0; s < countInClass; s++) {
      const isBoy = (studentCounter + s) % 2 === 0
      const pool = isBoy ? firstNamesBoy : firstNamesGirl
      const first = pool[(studentCounter * 7 + s * 3) % pool.length]
      const last = surnames[(studentCounter * 5 + s) % surnames.length]
      const roll = s + 1
      const reviewed = studentCounter % 3 === 0
      students.push({
        id: `STU${1000 + studentCounter}`,
        name: `${first} ${last}`,
        rollNo: roll,
        class: cls,
        gender: isBoy ? 'Boy' : 'Girl',
        age: classAgeMap[cls],
        teacherId: teacher.id,
        teacherName: teacher.name,
        schoolId: teacher.schoolId,
        schoolName: teacher.schoolName,
        district: teacher.district,
        block: teacher.block,
        cluster: teacher.cluster,
        attendance: 78 + ((studentCounter * 3 + s * 7) % 21),
        status: reviewed ? 'Completed' : 'Pending',
        review: reviewed
          ? ['Good', 'Average', 'Bad'][studentCounter % 3]
          : null,
        remarks: reviewed
          ? [
              'Shows great enthusiasm during class activities.',
              'Needs a bit more practice with reading aloud.',
              'Actively participates and helps classmates.',
              'Improving steadily week over week.',
              'Confident in class discussions and group work.',
            ][studentCounter % 5]
          : '',
        reviewDate: reviewed
          ? `2026-0${1 + (studentCounter % 7)}-${String(10 + (studentCounter % 18)).padStart(2, '0')}`
          : null,
        avatarSeed: `${first}${last}${studentCounter}`,
      })
      studentCounter++
    }
  })
})

// Ensure the sample named students from the spec exist explicitly
const sampleStudents = [
  { name: 'Aarav Patel', gender: 'Boy' },
  { name: 'Krish Shah', gender: 'Boy' },
  { name: 'Dhruv Parmar', gender: 'Boy' },
  { name: 'Vihaan Solanki', gender: 'Boy' },
  { name: 'Riya Patel', gender: 'Girl' },
  { name: 'Diya Joshi', gender: 'Girl' },
  { name: 'Mahi Desai', gender: 'Girl' },
  { name: 'Kavya Shah', gender: 'Girl' },
  { name: 'Jiya Patel', gender: 'Girl' },
]
sampleStudents.forEach((sample, idx) => {
  if (students[idx]) {
    students[idx].name = sample.name
    students[idx].gender = sample.gender
  }
})

// ---------------------------------------------------------------------------
// Verifiers (Admin managed)
// ---------------------------------------------------------------------------
export const verifiers = districtData.flatMap((district, dIdx) =>
  district.blocks.flatMap((block, bIdx) =>
    block.clusters.map((cluster, cIdx) => {
      const idx = dIdx * 10 + bIdx * 3 + cIdx
      const first = teacherFirstNames[(idx * 4 + 2) % teacherFirstNames.length]
      const last = surnames[(idx * 6 + 3) % surnames.length]
      return {
        id: `VER${100 + idx}`,
        name: `${first} ${last}`,
        mobile: `9${String(800000000 + idx * 137).slice(0, 9)}`,
        email: `${first}.${last}${idx}@nipungujarat.gov.in`.toLowerCase(),
        district: district.name,
        block: block.name,
        cluster,
        status: idx % 5 === 0 ? 'Inactive' : 'Active',
      }
    })
  )
)

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------
export const districts = districtData.map((d) => d.name)

export function getStudentsByTeacher(teacherId) {
  return students.filter((s) => s.teacherId === teacherId)
}

export function getStudentsGroupedByClass(teacherId) {
  const list = getStudentsByTeacher(teacherId)
  return classList
    .map((cls) => ({ cls, students: list.filter((s) => s.class === cls) }))
    .filter((group) => group.students.length > 0)
}

export function getTeacherStats(teacherId) {
  const list = getStudentsByTeacher(teacherId)
  const completed = list.filter((s) => s.status === 'Completed').length
  const pending = list.length - completed
  const classes = new Set(list.map((s) => s.class))
  return { total: list.length, completed, pending, classes: classes.size }
}

export function getAdminStats() {
  const totalStudents = students.length
  const reviewed = students.filter((s) => s.status === 'Completed').length
  const pending = totalStudents - reviewed
  return {
    schools: schools.length,
    teachers: teachers.length,
    studentsReviewed: reviewed,
    pendingReviews: pending,
    districts: districts.length,
    clusters: new Set(schools.map((s) => s.cluster)).size,
  }
}

export function getDistrictProgress() {
  return districts.map((d) => {
    const list = students.filter((s) => s.district === d)
    const completed = list.filter((s) => s.status === 'Completed').length
    return {
      district: d,
      total: list.length,
      completed,
      pct: list.length ? Math.round((completed / list.length) * 100) : 0,
    }
  })
}

export function getBlockProgress() {
  const blocks = {}
  students.forEach((s) => {
    const key = `${s.district} - ${s.block}`
    if (!blocks[key]) blocks[key] = { block: key, total: 0, completed: 0 }
    blocks[key].total++
    if (s.status === 'Completed') blocks[key].completed++
  })
  return Object.values(blocks).map((b) => ({
    ...b,
    pct: Math.round((b.completed / b.total) * 100),
  }))
}

export function getTeacherCompletion() {
  return teachers.map((t) => {
    const list = getStudentsByTeacher(t.id)
    const completed = list.filter((s) => s.status === 'Completed').length
    return {
      teacher: t.name,
      teacherId: t.id,
      total: list.length,
      completed,
      pending: list.length - completed,
      pct: list.length ? Math.round((completed / list.length) * 100) : 0,
    }
  })
}

export function getSchoolCompletion() {
  return schools.map((sch) => {
    const list = students.filter((s) => s.schoolId === sch.id)
    const completed = list.filter((s) => s.status === 'Completed').length
    return {
      school: sch.name,
      schoolId: sch.id,
      total: list.length,
      completed,
      pct: list.length ? Math.round((completed / list.length) * 100) : 0,
    }
  })
}

export function getCompletedReviews() {
  return students
    .filter((s) => s.status === 'Completed')
    .map((s) => ({ ...s }))
    .sort((a, b) => (a.reviewDate < b.reviewDate ? 1 : -1))
}
