import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface HealthRingProps {
    score: number;
    color: string;
    size?: number;
}

function HealthRing({ score, color, size = 72 }: HealthRingProps) {
    const strokeWidth = 7;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - score / 100);

    return (
        <View style={[ringStyles.wrapper, { width: size, height: size }]}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#1e293b"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={ringStyles.labelOverlay}>
                <Text style={ringStyles.scoreText}>{score}%</Text>
            </View>
        </View>
    );
}

const ringStyles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelOverlay: {
        position: 'absolute',
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
});

export default HealthRing;