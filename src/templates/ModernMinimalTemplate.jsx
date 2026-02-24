import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const colors = {
    primary: '#0d9488',
    text: '#1f2937',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',
    bg: '#ffffff',
    border: '#e5e7eb',
    skillBg: '#f0fdfa',
    skillText: '#0d9488',
};

const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 9, color: colors.text, backgroundColor: colors.bg, padding: '44px 36px' },
    header: { textAlign: 'center', marginBottom: 6 },
    fullName: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: colors.primary, letterSpacing: 1.5 },
    jobTitle: { fontSize: 10, fontWeight: 400, letterSpacing: 3, color: colors.textSecondary, marginTop: 3 },
    accentLine: { height: 2.5, backgroundColor: colors.primary, width: 80, alignSelf: 'center', marginTop: 8, marginBottom: 10, borderRadius: 2 },
    contactRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 4, marginBottom: 18 },
    contactItem: { fontSize: 7.5, color: colors.textMuted },
    contactSep: { fontSize: 7.5, color: colors.textMuted, marginHorizontal: 3 },
    sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: colors.primary, letterSpacing: 1, paddingBottom: 4, borderBottomWidth: 1.5, borderBottomColor: colors.border, marginBottom: 8, marginTop: 14 },
    summary: { fontSize: 8.5, color: colors.textSecondary, lineHeight: 1.65, marginBottom: 4 },
    expBlock: { marginBottom: 10 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 },
    expTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: colors.text },
    expDate: { fontSize: 7.5, color: colors.textMuted, fontWeight: 400 },
    expCompany: { fontSize: 8.5, color: colors.primary, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
    bulletItem: { flexDirection: 'row', marginBottom: 2.5, paddingLeft: 4 },
    bulletDot: { fontSize: 8, marginRight: 5, color: colors.primary, marginTop: 0.5 },
    bulletText: { fontSize: 8, color: colors.textSecondary, lineHeight: 1.55, flex: 1 },
    skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 4 },
    skillChip: { paddingVertical: 3, paddingHorizontal: 8, backgroundColor: colors.skillBg, borderRadius: 4, fontSize: 7.5, color: colors.skillText, fontFamily: 'Helvetica-Bold' },
    eduBlock: { marginBottom: 6 },
    eduRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    eduDegree: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: colors.text },
    eduInstitution: { fontSize: 8, color: colors.textSecondary, marginTop: 1 },
    eduDate: { fontSize: 7.5, color: colors.textMuted },
    certItem: { flexDirection: 'row', marginBottom: 2.5 },
});

export default function ModernMinimalTemplate({ data }) {
    const d = data || {};
    const p = d.personalInfo || {};
    const exp = (d.experience || []).filter(e => e.jobTitle || e.company);
    const edu = (d.education || []).filter(e => e.degree || e.institution);
    const skills = d.skills || {};
    const certs = (d.certifications || []).filter(c => c && c.trim());
    const hobbies = (d.hobbies || []).filter(h => h && h.trim());

    const allSkills = [
        ...(skills.programmingLanguages ? skills.programmingLanguages.split(',').map(s => s.trim()) : []),
        ...(skills.frameworks ? skills.frameworks.split(',').map(s => s.trim()) : []),
        ...(skills.devops ? skills.devops.split(',').map(s => s.trim()) : []),
        ...(skills.databases ? skills.databases.split(',').map(s => s.trim()) : []),
        ...(skills.other ? skills.other.split(',').map(s => s.trim()) : []),
    ].filter(Boolean);

    const contactParts = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);

    return (
        <Document>
            <Page size="A4" style={s.page}>
                <View style={s.header}>
                    <Text style={s.fullName}>{(p.fullName || 'YOUR NAME').toUpperCase()}</Text>
                    <Text style={s.jobTitle}>{(p.title || 'PROFESSIONAL TITLE').toUpperCase()}</Text>
                </View>
                <View style={s.accentLine} />

                {contactParts.length > 0 && (
                    <View style={s.contactRow}>
                        {contactParts.map((c, i) => (
                            <View key={i} style={{ flexDirection: 'row' }}>
                                {i > 0 && <Text style={s.contactSep}>•</Text>}
                                <Text style={s.contactItem}>{c}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {p.summary && (
                    <View wrap={false}>
                        <Text style={s.sectionTitle}>SUMMARY</Text>
                        <Text style={s.summary}>{p.summary}</Text>
                    </View>
                )}

                {exp.length > 0 && (
                    <View>
                        {exp.map((e, i) => (
                            <View key={i} style={s.expBlock}>
                                <View wrap={false}>
                                    {i === 0 && <Text style={s.sectionTitle}>EXPERIENCE</Text>}
                                    <View style={s.expHeader}>
                                        <Text style={s.expTitle}>{e.jobTitle}</Text>
                                        <Text style={s.expDate}>
                                            {e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}
                                        </Text>
                                    </View>
                                    <Text style={s.expCompany}>{e.company}</Text>
                                </View>
                                {(e.bullets || []).filter(b => b && b.trim()).map((b, bi) => (
                                    <View key={bi} style={s.bulletItem}>
                                        <Text style={s.bulletDot}>-</Text>
                                        <Text style={s.bulletText}>{b}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {edu.length > 0 && (
                    <View>
                        {edu.map((e, i) => (
                            <View key={i} style={s.eduBlock} wrap={false}>
                                {i === 0 && <Text style={s.sectionTitle}>EDUCATION</Text>}
                                <View style={s.eduRow}>
                                    <Text style={s.eduDegree}>{e.degree}</Text>
                                    <Text style={s.eduDate}>{e.graduationDate}</Text>
                                </View>
                                <Text style={s.eduInstitution}>{e.institution}{e.gpa ? ` • GPA: ${e.gpa}` : ''}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {allSkills.length > 0 && (
                    <View wrap={false}>
                        <Text style={s.sectionTitle}>SKILLS</Text>
                        <View style={s.skillsContainer}>
                            {allSkills.map((skill, i) => (
                                <Text key={i} style={s.skillChip}>{skill}</Text>
                            ))}
                        </View>
                    </View>
                )}

                {certs.length > 0 && (
                    <View>
                        {certs.map((c, i) => (
                            <View key={i} wrap={false}>
                                {i === 0 && <Text style={s.sectionTitle}>CERTIFICATIONS</Text>}
                                <View style={s.certItem}>
                                    <Text style={s.bulletDot}>-</Text>
                                    <Text style={s.bulletText}>{c}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {skills.languages && (
                    <View wrap={false}>
                        <Text style={s.sectionTitle}>LANGUAGES</Text>
                        <Text style={s.summary}>{skills.languages}</Text>
                    </View>
                )}

                {hobbies.length > 0 && (
                    <View wrap={false}>
                        <Text style={s.sectionTitle}>INTERESTS</Text>
                        <Text style={s.summary}>{hobbies.join(' • ')}</Text>
                    </View>
                )}
            </Page>
        </Document>
    );
}
