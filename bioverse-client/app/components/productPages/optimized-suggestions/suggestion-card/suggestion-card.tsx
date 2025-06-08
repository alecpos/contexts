'use client';
import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
} from '@mui/material';
export interface SuggestionCardData {
    imageRef: string;
    title: string;
    subtitle: string;
    description: string;
}

/**
 *
 * Call to action card attributes:
 * image | title | subtitle | description | button
 *
 * @returns
 */
export default function SuggestionCard({
    imageRef,
    title,
    subtitle,
    description,
}: SuggestionCardData) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                {/**Card image */}
                <CardMedia
                    component="img"
                    height="256"
                    image={imageRef}
                    alt="card-image"
                />

                {/**Card text */}
                <CardContent>
                    <Typography gutterBottom className="body1" component="div">
                        {title}
                    </Typography>
                    <Typography className="label1">{subtitle}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className="flex justify-center">
                <Button variant="contained">LEARN MORE</Button>
            </CardActions>
        </Card>
    );
}
