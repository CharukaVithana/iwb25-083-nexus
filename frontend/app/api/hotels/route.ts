import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward request to Ballerina backend
    const backendUrl = new URL('http://localhost:9091/hotels/search');
    
    // Copy all search parameters to backend request
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const response = await fetch(backendUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }
    
    const hotels = await response.json();
    return NextResponse.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}
