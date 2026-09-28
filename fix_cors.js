const fs = require('fs');
const files = [
  'src/app/api/tournaments/route.ts',
  'src/app/api/registrations/route.ts',
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const optionsMethod = 

export async function OPTIONS() {
  return NextResponse.json({}, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }});
}
;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace NextResponse.json(...) with NextResponse.json(..., { headers: corsHeaders }) in GET methods
  content = content.replace(/return NextResponse\.json\((.*?)\);/g, (match, p1) => {
    // If it already has options, this regex might be too simple, but let's check
    if (match.includes(', { status:')) {
       return match.replace('}', ", 'Access-Control-Allow-Origin': '*'}");
    }
    return eturn NextResponse.json(, { headers: { 'Access-Control-Allow-Origin': '*' } });;
  });
  
  // Fix the catch blocks which look like: return NextResponse.json({ error: "..." }, { status: 500 });
  content = content.replace(/, { status: 500 }/g, ", { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }");

  if (!content.includes('export async function OPTIONS')) {
    content += optionsMethod;
  }
  
  fs.writeFileSync(file, content);
}
