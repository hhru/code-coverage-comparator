const fs = require('fs');
const xml2js = require('xml2js');

const NUMBERS_AFTER_COMMA_IN_PERCENTAGE = 10 ** 2;
const PERCENTAGE = 10 ** 2;

function getStatements(content) {
    return new Promise((resolve, reject) => {
        // Мы не используем DOMParser, т.к. он присутствует только в браузере, но не в Node.js
        const parser = new xml2js.Parser();
        parser.parseString(content, (err, result) => {
            if (err) {
                reject(err);
            }
            const attr = result.coverage.project[0].metrics[0].$;
            resolve([attr.statements, attr.coveredstatements]);
        });
    });
}

function getData(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(getStatements(data));
        });
    });
}

module.exports = function(masterFile, branchFile, resultFile) {
    return Promise.all([getData(branchFile), getData(masterFile)]).then(
        ([[branchStatements, branchCoveredStatements], [masterStatements, masterCoveredStatements]]) => {
            const branchPercentage =
                Math.round(
                    (branchCoveredStatements / branchStatements) * PERCENTAGE * NUMBERS_AFTER_COMMA_IN_PERCENTAGE
                ) / NUMBERS_AFTER_COMMA_IN_PERCENTAGE;
            const masterPercentage =
                Math.round(
                    (masterCoveredStatements / masterStatements) * PERCENTAGE * NUMBERS_AFTER_COMMA_IN_PERCENTAGE
                ) / NUMBERS_AFTER_COMMA_IN_PERCENTAGE;

            const stats = {
                master: {
                    statements: masterStatements,
                    coveredStatements: masterCoveredStatements,
                    percentage: masterPercentage,
                },
                branch: {
                    statements: branchStatements,
                    coveredStatements: branchCoveredStatements,
                    percentage: branchPercentage,
                },
                diff: branchPercentage - masterPercentage,
            };

            fs.writeFileSync(resultFile, JSON.stringify(stats, '  ', 2));

            if (branchPercentage - masterPercentage < 0) {
                throw new Error('Branch has less covered lines of code than master: ', JSON.stringify(stats, '  ', 2));
            }
        }
    );
};
