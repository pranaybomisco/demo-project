export const handleApiResponse = (response) => {
  return response.data?.data !== undefined ? response.data.data : response.data;
};
