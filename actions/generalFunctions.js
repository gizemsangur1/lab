export const calculateAge = (dateOfBirth) => {
	if (!dateOfBirth) return "N/A";
	const birthDate = new Date(dateOfBirth.seconds * 1000);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
	  age--;
	}
	return age;
  };

  export const formatDate = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";

    if (dateOfBirth.seconds) {
      const date = new Date(dateOfBirth.seconds * 1000);
      return date.toDateString();
    }

    return dateOfBirth.toString();
  };