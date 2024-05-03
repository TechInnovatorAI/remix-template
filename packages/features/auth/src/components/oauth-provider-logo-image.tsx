import { AtSign, Phone } from 'lucide-react';

const DEFAULT_IMAGE_SIZE = 18;

export const OauthProviderLogoImage: React.FC<{
  providerId: string;
  width?: number;
  height?: number;
}> = ({ providerId, width, height }) => {
  const image = getOAuthProviderLogos()[providerId];

  if (typeof image === `string`) {
    return (
      <img
        decoding={'async'}
        loading={'lazy'}
        src={image}
        alt={`${providerId} logo`}
        width={width ?? DEFAULT_IMAGE_SIZE}
        height={height ?? DEFAULT_IMAGE_SIZE}
      />
    );
  }

  return <>{image}</>;
};

function getOAuthProviderLogos(): Record<string, string | React.ReactNode> {
  return {
    password: <AtSign className={'s-[18px]'} />,
    phone: <Phone className={'s-[18px]'} />,
    google: '/images/oauth/google.webp',
    facebook: '/images/oauth/facebook.webp',
    twitter: '/images/oauth/twitter.webp',
    github: '/images/oauth/github.webp',
    microsoft: '/images/oauth/microsoft.webp',
    apple: '/images/oauth/apple.webp',
  };
}
