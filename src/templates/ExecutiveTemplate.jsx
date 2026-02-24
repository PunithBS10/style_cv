import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const colors = {
    sidebar: '#2d2d3f',
    sidebarText: '#ffffff',
    sidebarMuted: 'rgba(255,255,255,0.65)',
    accent: '#f5c518',
    mainBg: '#ffffff',
    textPrimary: '#1a1a2e',
    textSecondary: '#444466',
    textMuted: '#777799',
};

const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 9, color: colors.textPrimary },
    // Sidebar elements
    sidebarSectionTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5, marginBottom: 6, marginTop: 14, color: colors.sidebarText },
    sidebarDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 8 },
    contactItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5, gap: 6 },
    contactIcon: { fontSize: 8, color: colors.accent, width: 12 },
    contactText: { fontSize: 8, color: colors.sidebarMuted, flex: 1 },
    sidebarBody: { fontSize: 8, color: colors.sidebarMuted, lineHeight: 1.5, marginBottom: 3 },
    skillCategory: { marginBottom: 5 },
    skillLabel: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: colors.sidebarText, marginBottom: 1 },
    skillValue: { fontSize: 7.5, color: colors.sidebarMuted, lineHeight: 1.4 },
    hobbyItem: { fontSize: 7.5, color: colors.sidebarMuted, marginBottom: 3, lineHeight: 1.4 },

    // Main content elements
    nameBlock: { marginBottom: 4 },
    fullName: { fontSize: 22, fontFamily: 'Helvetica-Bold', letterSpacing: 2, color: colors.textPrimary },
    jobTitle: { fontSize: 9.5, letterSpacing: 3, color: colors.textSecondary, fontWeight: 400, marginTop: 2 },
    accentLine: { height: 3, backgroundColor: colors.accent, marginTop: 8, marginBottom: 16, width: 60 },
    mainSectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', letterSpacing: 1, color: colors.textPrimary, marginBottom: 8, marginTop: 14 },
    summary: { fontSize: 8.5, color: colors.textSecondary, lineHeight: 1.6, textAlign: 'justify', marginBottom: 4 },
    expBlock: { marginBottom: 10 },
    expTitle: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: colors.textPrimary },
    expCompany: { fontSize: 8, color: colors.textMuted, marginBottom: 4 },
    bulletItem: { flexDirection: 'row', marginBottom: 3, paddingLeft: 2 },
    bulletDot: { fontSize: 8, marginRight: 5, color: colors.textSecondary, marginTop: 0.5 },
    bulletText: { fontSize: 8, color: colors.textSecondary, lineHeight: 1.5, flex: 1 },
    certItem: { flexDirection: 'row', marginBottom: 3, paddingLeft: 2 },
});

export default function ExecutiveTemplate({ data }) {
    const d = data || {};
    const p = d.personalInfo || {};
    const exp = (d.experience || []).filter(e => e.jobTitle || e.company);
    const edu = (d.education || []).filter(e => e.degree || e.institution);
    const skills = d.skills || {};
    const certs = (d.certifications || []).filter(c => c && c.trim());
    const hobbies = (d.hobbies || []).filter(h => h && h.trim());

    const hasSkills = skills.programmingLanguages || skills.frameworks || skills.devops || skills.databases || skills.other;

    return (
        <Document>
            <Page size="A4" style={s.page}>
                {/* Fixed Background Layer (paints perfectly on every page) */}
                <View fixed style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', zIndex: -1 }}>
                    <View style={{ width: 8, backgroundColor: colors.accent }} />
                    <View style={{ width: '34%', backgroundColor: colors.sidebar }} />
                    <View style={{ flex: 1, backgroundColor: colors.mainBg }} />
                    <View style={{ width: 8, backgroundColor: colors.accent }} />
                </View>

                {/* Content Flow Layer */}
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ width: 8 }} />

                    {/* Sidebar Area */}
                    <View style={{ width: '34%', padding: '24px 16px', color: colors.sidebarText }}>
                        {p.photoUrl && (
                            <Image
                                src={p.photoUrl}
                                style={{ width: 72, height: 72, borderRadius: 36, alignSelf: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#ffffff', objectFit: 'cover' }}
                            />
                        )}

                        {/* Contact */}
                        <Text style={s.sidebarSectionTitle}>CONTACT</Text>
                        <View style={s.sidebarDivider} />
                        {p.email && (
                            <View style={s.contactItem}>
                                <Text style={s.contactIcon}>@</Text>
                                <Text style={s.contactText}>{p.email}</Text>
                            </View>
                        )}
                        {p.phone && (
                            <View style={s.contactItem}>
                                <Text style={s.contactIcon}>#</Text>
                                <Text style={s.contactText}>{p.phone}</Text>
                            </View>
                        )}
                        {p.location && (
                            <View style={s.contactItem}>
                                <Text style={s.contactIcon}>{'>'}</Text>
                                <Text style={s.contactText}>{p.location}</Text>
                            </View>
                        )}
                        {(p.linkedin || p.github || p.portfolio) && (
                            <View style={s.contactItem}>
                                <Text style={s.contactIcon}>~</Text>
                                <Text style={s.contactText}>
                                    {[p.linkedin, p.github, p.portfolio].filter(Boolean).join(' | ')}
                                </Text>
                            </View>
                        )}

                        {/* Education */}
                        {edu.length > 0 && (
                            <View>
                                {edu.map((e, i) => (
                                    <View key={i} style={{ marginBottom: 6 }} wrap={false}>
                                        {i === 0 && (
                                            <>
                                                <Text style={s.sidebarSectionTitle}>EDUCATION</Text>
                                                <View style={s.sidebarDivider} />
                                            </>
                                        )}
                                        <Text style={[s.sidebarBody, { fontWeight: 700, color: '#fff' }]}>{e.degree}</Text>
                                        <Text style={s.sidebarBody}>{e.institution}{e.graduationDate ? ` (${e.graduationDate})` : ''}</Text>
                                        {e.gpa && <Text style={s.sidebarBody}>GPA: {e.gpa}</Text>}
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Skills */}
                        {hasSkills && (
                            <View wrap={false}>
                                <Text style={s.sidebarSectionTitle}>KEY SKILLS</Text>
                                <View style={s.sidebarDivider} />
                                {skills.programmingLanguages && (
                                    <View style={s.skillCategory}>
                                        <Text style={s.skillLabel}>Programming:</Text>
                                        <Text style={s.skillValue}>{skills.programmingLanguages}</Text>
                                    </View>
                                )}
                                {skills.frameworks && (
                                    <View style={s.skillCategory}>
                                        <Text style={s.skillLabel}>Frameworks/Tools:</Text>
                                        <Text style={s.skillValue}>{skills.frameworks}</Text>
                                    </View>
                                )}
                                {skills.devops && (
                                    <View style={s.skillCategory}>
                                        <Text style={s.skillLabel}>DevOps:</Text>
                                        <Text style={s.skillValue}>{skills.devops}</Text>
                                    </View>
                                )}
                                {skills.databases && (
                                    <View style={s.skillCategory}>
                                        <Text style={s.skillLabel}>Database:</Text>
                                        <Text style={s.skillValue}>{skills.databases}</Text>
                                    </View>
                                )}
                                {skills.other && (
                                    <View style={s.skillCategory}>
                                        <Text style={s.skillLabel}>Other:</Text>
                                        <Text style={s.skillValue}>{skills.other}</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Languages (Spoken) */}
                        {skills.languages && (
                            <View wrap={false}>
                                <Text style={s.sidebarSectionTitle}>LANGUAGES</Text>
                                <View style={s.sidebarDivider} />
                                <Text style={s.hobbyItem}>{skills.languages}</Text>
                            </View>
                        )}

                        {/* Hobbies */}
                        {hobbies.length > 0 && (
                            <View>
                                <View wrap={false}>
                                    <Text style={s.sidebarSectionTitle}>HOBBIES</Text>
                                    <View style={s.sidebarDivider} />
                                    <View style={s.bulletItem}>
                                        <Text style={[s.bulletDot, { color: colors.accent }]}>•</Text>
                                        <Text style={s.hobbyItem}>{hobbies[0]}</Text>
                                    </View>
                                </View>
                                {hobbies.slice(1).map((h, i) => (
                                    <View key={i + 1} style={s.bulletItem} wrap={false}>
                                        <Text style={[s.bulletDot, { color: colors.accent }]}>•</Text>
                                        <Text style={s.hobbyItem}>{h}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Main Content Area */}
                    <View style={{ flex: 1, padding: '24px 22px' }}>
                        <View style={s.nameBlock}>
                            <Text style={s.fullName}>{(p.fullName || 'YOUR NAME').toUpperCase()}</Text>
                            <Text style={s.jobTitle}>{(p.title || 'PROFESSIONAL TITLE').toUpperCase()}</Text>
                        </View>
                        <View style={s.accentLine} />

                        {/* Summary */}
                        {p.summary && (
                            <View wrap={false}>
                                <Text style={s.mainSectionTitle}>PROFESSIONAL SUMMARY</Text>
                                <Text style={s.summary}>{p.summary}</Text>
                            </View>
                        )}

                        {/* Experience */}
                        {exp.length > 0 && (
                            <View>
                                {exp.map((e, i) => (
                                    <View key={i} style={s.expBlock}>
                                        <View wrap={false}>
                                            {i === 0 && <Text style={s.mainSectionTitle}>PROFESSIONAL EXPERIENCE</Text>}
                                            <Text style={s.expTitle}>{e.jobTitle}</Text>
                                            <Text style={s.expCompany}>
                                                {e.company}{e.startDate ? ` (${e.startDate}` : ''}{e.endDate ? ` – ${e.endDate})` : e.startDate ? ')' : ''}
                                            </Text>
                                        </View>
                                        {(e.bullets || []).filter(b => b && b.trim()).map((b, bi) => (
                                            <View key={bi} style={s.bulletItem} wrap={false}>
                                                <Text style={s.bulletDot}>•</Text>
                                                <Text style={s.bulletText}>{b}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Certifications */}
                        {certs.length > 0 && (
                            <View>
                                {certs.map((c, i) => (
                                    <View key={i} wrap={false}>
                                        {i === 0 && <Text style={s.mainSectionTitle}>ACHIEVEMENTS & CERTIFICATIONS</Text>}
                                        <View style={s.certItem}>
                                            <Text style={s.bulletDot}>•</Text>
                                            <Text style={s.bulletText}>{c}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={{ width: 8 }} />
                </View>
            </Page>
        </Document>
    );
}
