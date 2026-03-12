import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 50,
        paddingRight: 50,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#000000',
        lineHeight: 1.5,
    },
    senderName: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        color: '#000000',
        marginBottom: 4,
    },
    senderInfo: {
        fontSize: 9,
        color: '#333333',
        marginBottom: 2,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        marginTop: 12,
        marginBottom: 16,
    },
    dateText: {
        fontSize: 10,
        color: '#000000',
        textAlign: 'right',
        marginBottom: 16,
    },
    paragraph: {
        marginBottom: 10,
        textAlign: 'justify',
        fontSize: 10,
        lineHeight: 1.55,
    },
    signature: {
        marginTop: 20,
    },
    signOff: {
        marginBottom: 20,
        fontSize: 10,
    },
    signName: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#000000',
    },
});

export default function CoverLetterTemplate({ cvData, coverLetterText }) {
    const { personalInfo } = cvData || {};
    const { fullName = '', email = '', phone = '', location = '' } = personalInfo || {};

    const paragraphs = (coverLetterText || '').split('\n').filter(p => p.trim() !== '');

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Sender Header */}
                <View>
                    <Text style={styles.senderName}>{fullName}</Text>
                    {location && <Text style={styles.senderInfo}>{location}</Text>}
                    {phone && <Text style={styles.senderInfo}>{phone}</Text>}
                    {email && <Text style={styles.senderInfo}>{email}</Text>}
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Date (right-aligned) */}
                <Text style={styles.dateText}>{today}</Text>

                {/* Body Paragraphs (includes recipient block from AI + letter body) */}
                <View>
                    {paragraphs.map((para, i) => (
                        <Text key={i} style={styles.paragraph}>
                            {para.trim()}
                        </Text>
                    ))}
                </View>

                {/* Signature */}
                <View style={styles.signature}>
                    <Text style={styles.signOff}>Sincerely,</Text>
                    <Text style={styles.signName}>{fullName}</Text>
                </View>
            </Page>
        </Document>
    );
}
