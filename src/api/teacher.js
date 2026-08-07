import { apiRequest, setSession, clearSession, getSession } from './client'

export function mapTeacherProfile(teacher, school) {
  return {
    id: teacher.teachercode,
    teacherId: teacher.teachercode,
    name: teacher.teachername,
    designation: teacher.designation || 'Teacher',
    gender: '—',
    schoolId: school.schoolid,
    schoolName: school.school,
    schoolCode: school.udise || school.schoolid,
    district: school.district || '',
    block: school.block || '',
    cluster: school.cluster || school.village || '',
    village: school.village || '',
    classesAssigned: [],
    avatarSeed: teacher.teachercode,
  }
}

function ageFromDob(dob) {
  if (!dob) return null
  const d = new Date(dob)
  if (Number.isNaN(d.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1
  return age
}

function mapGender(gender) {
  if (!gender) return '—'
  const g = String(gender).toLowerCase()
  if (g.startsWith('m') || g === 'boy') return 'Boy'
  if (g.startsWith('f') || g === 'girl') return 'Girl'
  return gender
}

export function mapRegistryStudent(student, meta = {}) {
  const subjects = student.subjects || {
    Gujarati: null,
    Maths: null,
  }
  return {
    id: student.studentid,
    name: student.name,
    rollNo: student.gr_no || '—',
    class: student.classLabel || `Grade ${student.grade}`,
    gender: mapGender(student.gender),
    age: ageFromDob(student.dob),
    teacherId: meta.teacherId,
    teacherName: meta.teacherName,
    schoolId: student.schoolid || meta.schoolId,
    schoolName: meta.schoolName || '',
    district: meta.district || '',
    block: meta.block || '',
    cluster: meta.cluster || '',
    attendance: null,
    status: student.status || (student.isDone ? 'Completed' : 'Pending'),
    subjects: {
      Gujarati: subjects.Gujarati || null,
      Maths: subjects.Maths || null,
    },
    review: subjects.Gujarati?.review || student.review || null,
    remarks: subjects.Gujarati?.remarks || student.remarks || '',
    reviewDate: student.reviewDate || null,
    avatarSeed: student.studentid,
    section: student.section || '',
  }
}

export async function loginTeacher({ teacherCode, ssoDetails = {} }) {
  const res = await apiRequest('/auth/login', {
    method: 'POST',
    auth: false,
    body: {
      teacherCode: String(teacherCode).trim(),
      ssoDetails,
    },
  })

  const data = res.data
  setSession({
    sessionToken: data.sessionToken,
    userId: data.userDetails.userId,
    roleId: data.userDetails.roleId,
  })

  return {
    teacher: mapTeacherProfile(data.teacher, data.school),
    school: data.school,
  }
}

export async function logoutTeacher() {
  try {
    if (getSession()?.sessionToken) {
      await apiRequest('/auth/logout', { method: 'POST' })
    }
  } catch {
    // ignore logout network errors — clear local session anyway
  } finally {
    clearSession()
  }
}

export async function fetchTeacherProfile() {
  const res = await apiRequest('/teacher/profile', { method: 'POST' })
  return {
    teacher: mapTeacherProfile(res.data.teacher, res.data.school),
    school: res.data.school,
  }
}

export async function fetchTeacherStudents(grade) {
  const qs = grade ? `?grade=${encodeURIComponent(grade)}` : ''
  const res = await apiRequest(`/teacher/students${qs}`)
  const payload = res.data
  const meta = {
    teacherId: payload.teacherId,
    teacherName: payload.teacherName,
    schoolId: payload.schoolId,
  }
  return {
    students: (payload.students || []).map((s) => mapRegistryStudent(s, meta)),
    classesAssigned: payload.classesAssigned || [],
    meta,
    round: payload.round || null,
    canSubmit: Boolean(payload.canSubmit),
    stage: payload.stage || null,
  }
}

export async function submitStudentReview(studentId, { reviews }) {
  const res = await apiRequest(`/reviews/${encodeURIComponent(studentId)}`, {
    method: 'PUT',
    body: { reviews },
  })
  return res.data
}
