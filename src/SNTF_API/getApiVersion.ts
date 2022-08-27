import axios from 'axios';

export async function getApiVersion(SNTF_HOST: string): Promise<number> {
  return (
    2066 ||
    (
      await axios.default.get<{ data: number }>('/api/schedules/lv', {
        baseURL: SNTF_HOST,
      })
    ).data?.data
  );
}
