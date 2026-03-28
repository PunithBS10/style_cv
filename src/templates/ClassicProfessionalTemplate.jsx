import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const colors = {
    navy: '#1e3a5f',
    gold: '#c8a84e',
    text: '#2d3748',
    textSecondary: '#4a5568',
    textMuted: '#a0aec0',
    bg: '#ffffff',
    border: '#e2e8f0',
};

const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 9, color: colors.text, backgroundColor: colors.bg, padding: '44px 36px' },
    topBorder: { position: 'absolute', top: 0, left: 0, right: 0, height: 5, backgroundColor: colors.navy },
    bottomBorder: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: colors.navy },
    header: { textAlign: 'center', marginTop: 8, marginBottom: 4 },
    fullName: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: colors.navy, letterSpacing: 2 },
    goldLine: { height: 1.5, backgroundColor: colors.gold, width: 50, alignSelf: 'center', marginVertical: 6 },
    jobTitle: { fontSize: 9.5, fontWeight: 400, letterSpacing: 3, color: colors.textSecondary, marginTop: 2 },
    contactRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16, marginTop: 8, gap: 4, flexWrap: 'wrap' },
    contactItem: { fontSize: 7.5, color: colors.textMuted },
    contactSep: { fontSize: 7.5, color: colors.textMuted, marginHorizontal: 4 },
    sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: colors.navy, letterSpacing: 1.5, paddingBottom: 4, borderBottomWidth: 2, borderBottomColor: colors.navy, marginBottom: 10, marginTop: 16 },
    summary: { fontSize: 8.5, color: colors.textSecondary, lineHeight: 1.65, textAlign: 'justify', marginBottom: 4 },
    expBlock: { marginBottom: 12 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1 },
    expTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: colors.navy },
    expDate: { fontSize: 7.5, color: colors.textMuted, fontStyle: 'italic' },
    expCompany: { fontSize: 8.5, color: colors.textSecondary, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
    bulletItem: { flexDirection: 'row', marginBottom: 2.5, paddingLeft: 6 },
    bulletDot: { fontSize: 6, marginRight: 6, color: colors.gold, marginTop: 1.5 },
    bulletText: { fontSize: 8, color: colors.textSecondary, lineHeight: 1.55, flex: 1 },
    eduBlock: { marginBottom: 8 },
    eduDegree: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: colors.text },
    eduInstitution: { fontSize: 8, color: colors.textSecondary, marginTop: 1 },
    eduDate: { fontSize: 7.5, color: colors.textMuted, marginTop: 1 },
    skillSection: { marginBottom: 5 },
    skillLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: colors.navy, marginBottom: 1.5 },
    skillValue: { fontSize: 7.5, color: colors.textSecondary, lineHeight: 1.5 },
    certItem: { flexDirection: 'row', marginBottom: 3 },
    hobbyText: { fontSize: 8, color: colors.textSecondary, lineHeight: 1.5 },
});

const getNameFontSize = (name, base) => Math.max(14, base - Math.max(0, (name.length - 18)) * 0.5);

export default function ClassicProfessionalTemplate({ data }) {
    const d = data || {};
    const p = d.personalInfo || {};
    const exp = (d.experience || []).filter(e => e.jobTitle || e.company);
    const projects = (d.projects || []).filter(p => p.name || p.technologies);
    const edu = (d.education || []).filter(e => e.degree || e.institution);
    const skills = d.skills || {};
    const certs = (d.certifications || []).filter(c => c && c.trim());
    const hobbies = (d.hobbies || []).filter(h => h && h.trim());

    const hasSkills = skills.programmingLanguages || skills.frameworks || skills.devops || skills.databases || skills.other;
    const contactParts = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);

    return (
        <Document>
            <Page size="A4" style={s.page}>
                <View style={s.topBorder} fixed />
                <View style={s.bottomBorder} fixed />

                {/* Header */}
                <View style={s.header}>
                    <Text style={[s.fullName, { fontSize: getNameFontSize(p.fullName || 'YOUR NAME', 26) }]}>{(p.fullName || 'YOUR NAME').toUpperCase()}</Text>
                    <View style={s.goldLine} />
                    <Text style={s.jobTitle}>{(p.title || 'PROFESSIONAL TITLE').toUpperCase()}</Text>
                </View>

                {/* Contact */}
                {contactParts.length > 0 && (
                    <View style={s.contactRow}>
                        {contactParts.map((c, i) => (
                            <View key={i} style={{ flexDirection: 'row' }}>
                                {i > 0 && <Text style={s.contactSep}>|</Text>}
                                <Text style={s.contactItem}>{c}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Summary */}
                {p.summary && (
                    <View wrap={false}>
                        <Text style={s.sectionTitle}>PROFESSIONAL SUMMARY</Text>
                        <Text style={s.summary}>{p.summary}</Text>
                    </View>
                )}

                {/* Experience */}
                {exp.length > 0 && (
                    <View>
                        {exp.map((e, i) => (
                            <View key={i} style={s.expBlock}>
                                <View wrap={false}>
                                    {i === 0 && <Text style={s.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>}
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

                {/* Projects */}
                {projects.length > 0 && (
                    <View>
                        {projects.map((proj, i) => (
                            <View key={i} style={s.expBlock}>
                                <View wrap={false}>
                                    {i === 0 && <Text style={s.sectionTitle}>PROJECTS</Text>}
                                    <View style={s.expHeader}>
                                        <Text style={s.expTitle}>{proj.name}</Text>
                                        <Text style={s.expDate}>
                                            {proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ''}
                                        </Text>
                                    </View>
                                    <Text style={s.expCompany}>{proj.technologies}</Text>
                                </View>
                                {(proj.bullets || []).filter(b => b && b.trim()).map((b, bi) => (
                                    <View key={bi} style={s.bulletItem} wrap={false}>
                                        <Text style={s.bulletDot}>-</Text>
                                        <Text style={s.bulletText}>{b}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {edu.length > 0 && (
                    <View>
                        {edu.map((e, i) => (
                            <View key={i} style={s.eduBlock} wrap={false}>
                                {i === 0 && <Text style={s.sectionTitle}>EDUCATION</Text>}
                                <Text style={s.eduDegree}>{e.degree}</Text>
                                <Text style={s.eduInstitution}>{e.institution}</Text>
                                <Text style={s.eduDate}>{e.graduationDate}{e.gpa ? ` • GPA: ${e.gpa}` : ''}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Technical Skills */}
                {hasSkills && (
                    <View wrap={false}>
                        <Text style={s.sectionTitle}>TECHNICAL SKILLS</Text>
                        {skills.programmingLanguages && (
                            <View style={s.skillSection}>
                                <Text style={s.skillLabel}>Programming Languages</Text>
                                <Text style={s.skillValue}>{skills.programmingLanguages}</Text>
                            </View>
                        )}
                        {skills.frameworks && (
                            <View style={s.skillSection}>
                                <Text style={s.skillLabel}>Frameworks & Tools</Text>
                                <Text style={s.skillValue}>{skills.frameworks}</Text>
                            </View>
                        )}
                        {skills.devops && (
                            <View style={s.skillSection}>
                                <Text style={s.skillLabel}>DevOps & Cloud</Text>
                                <Text style={s.skillValue}>{skills.devops}</Text>
                            </View>
                        )}
                        {skills.databases && (
                            <View style={s.skillSection}>
                                <Text style={s.skillLabel}>Databases</Text>
                                <Text style={s.skillValue}>{skills.databases}</Text>
                            </View>
                        )}
                        {skills.other && (
                            <View style={s.skillSection}>
                                <Text style={s.skillLabel}>Other</Text>
                                <Text style={s.skillValue}>{skills.other}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Certifications */}
                {certs.length > 0 && (
                    <View>
                        {certs.map((c, i) => (
                            <View key={i} wrap={false}>
                                {i === 0 && <Text style={s.sectionTitle}>CERTIFICATIONS & AWARDS</Text>}
                                <View style={s.certItem}>
                                    <Text style={s.bulletDot}>-</Text>
                                    <Text style={s.bulletText}>{c}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Languages (Spoken) */}
                {skills.languages && (
                    <View wrap={false}>
                        <Text style={s.sectionTitle}>LANGUAGES</Text>
                        <Text style={s.hobbyText}>{skills.languages}</Text>
                    </View>
                )}

                {/* Hobbies */}
                {hobbies.length > 0 && (
                    <View wrap={false}>
                        <Text style={s.sectionTitle}>INTERESTS</Text>
                        <Text style={s.hobbyText}>{hobbies.join('  |  ')}</Text>
                    </View>
                )}
            </Page>
        </Document>
    );
}
