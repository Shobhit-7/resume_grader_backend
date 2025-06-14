
function gradeResume(text) {
  let score = 0;
  const feedback = [];

  // Section checks
  if (text.toLowerCase().includes("education")) score += 20;
  else feedback.push("Add an Education section");

  if (text.toLowerCase().includes("experience")) score += 20;
  else feedback.push("Include work or internship experience");

  if (text.match(/(python|c\+\+|java|sql)/i)) score += 20;
  else feedback.push("Add technical skills like Python, SQL, etc.");

  if (text.match(/\d+%|\$\d+/)) score += 20;
  else feedback.push("Quantify achievements (e.g., 'Increased by 20%')");

  if (text.length > 1000) score += 20;
  else feedback.push("Your resume is too short. Add more relevant content.");

  return {
    score,
    feedback
  };
}

module.exports = { gradeResume };
