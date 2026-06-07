/**
 * Shared Mathematical Web Worker
 * Offloads heavy mathematical and statistical tasks (GPA calculation, sorting, analytics)
 * from the main UI thread to prevent blocking.
 */
self.onmessage = function(e) {
    const { type, data } = e.data;

    switch (type) {
        case "calculateGPA": {
            // data format: [{ grade: 'A', credits: 4 }]
            let totalCredits = 0;
            let weightedScore = 0;
            const gradePoints = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };

            data.forEach(item => {
                const credits = parseFloat(item.credits) || 0;
                const point = gradePoints[item.grade.toUpperCase()] || 0;
                totalCredits += credits;
                weightedScore += (point * credits);
            });

            const gpa = totalCredits > 0 ? (weightedScore / totalCredits).toFixed(2) : "0.00";
            self.postMessage({ type: "calculateGPA_result", result: { gpa, totalCredits } });
            break;
        }

        case "sortData": {
            // Sort large datasets
            const sorted = [...data].sort((a, b) => a - b);
            self.postMessage({ type: "sortData_result", result: sorted });
            break;
        }

        default:
            self.postMessage({ error: "Unsupported calculation type" });
    }
};
